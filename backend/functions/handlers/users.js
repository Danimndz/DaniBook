const { db, admin } = require("../util/admin");

const firebase = require("firebase");

const config = require("../util/config");

firebase.initializeApp(config);

const {
  validateSignUpData,
  validateLoginData,
  checkExtraUserData,
} = require("../util/validators");

////////////////////////SIGNUP///////////////////////////////
exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPass: request.body.confirmPass,
    handle: request.body.handle,
  };

  const { valid, sprError } = validateSignUpData(newUser);

  if (!valid) return response.status(400).json(sprError);

  const img = "profilePicture.png";
  let tkn, uId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      uId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((token) => {
      tkn = token;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${img}?alt=media`,
        userId: uId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ token: tkn });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        return response.status(400).json({ email: "This email is alredy use" });
      else
        return response
          .status(500)
          .json({ general: "Something went wrong, please try again" });
    });
};
//////////////////////LOGIN///////////////////////////////////////
exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, sprError } = validateLoginData(user);

  if (!valid) return result.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.json({ token });
    })
    .catch((err) => {
      console.error(err);
      return response
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

////////////////// UPLOAD IMAGE////////////////////

exports.uploadImg = (request, response) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: request.headers });
  let imgName;
  let imgToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png")
      return response.status(400).json({ error: "Wrong file type" });
    const imgExtension = filename.split(".")[filename.split.length - 1];
    imgName = `${Math.round(Math.random() * 100000000)}.${imgExtension}`;
    const filepath = path.join(os.tmpdir(), imgName);
    imgToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imgToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          contentType: imgToBeUploaded.mimetype,
        },
      })
      .then(() => {
        const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imgName}?alt=media`;
        return db
          .doc(`/users/${request.user.handle}`)
          .update({ imageURL: imgUrl });
      })
      .then(() => {
        return response.json({ message: "Image uploaded succesfully" });
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
      });
  });
  busboy.end(request.rawBody);
};

///////////////////////////////////////ADD USER INFO///////////////////////////////////////////////////////
exports.addUserInfo = (request, response) => {
  let userData = checkExtraUserData(request.body);

  db.doc(`/users/${request.user.handle}`)
    .update(userData)
    .then(() => {
      return response.json({ message: "Details Added" });
    })
    .catch((err) => {
      response.status(500).json({ error: err.code });
    });
};

/////////////////////////////////////////GET USER DETAILS/////////////////////

exports.getUserDetails = (request, response) => {
  let profileData = {};
  db.doc(`users/${request.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        profileData.usrData = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", request.user.handle)
          .get();
      }
    })
    .then((data) => {
      profileData.likes = [];
      data.forEach((doc) => {
        profileData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", request.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      profileData.notifications = [];
      data.forEach((doc) => {
        profileData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          daniId: doc.data().daniId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return response.json(profileData);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

/////////////////////////////////////GET PUBLIC USER DETAILS//////////////////////////

exports.getPublicUserDetails = (request, response) => {
  let userData = {};
  db.doc(`users/${request.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("danis")
          .where("userHandle", "==", request.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return response.status(404).json({ error: "User not found" });
      }
    })
    .then((data) => {
      userData.danis = [];
      data.forEach((doc) => {
        userData.danis.push({
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          daniId: doc.id,
        });
      });
      return response.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.markNotificationsRead = (request, response) => {
  request.body.forEach((notification) => {
    db.doc(`/notifications/${notification.notificationId}`)
      .update({ read: true })
      .then(() => {
        return response.json({ message: "notifications marked read" });
      })
      .catch((err) => {
        return response.status(500).json({ error: err.code });
      });
  });
};
