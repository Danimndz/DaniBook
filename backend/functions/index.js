const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
let app = express();

app.use(cors({ origin: true, header: "AllowSpecificOrigin" }));

const Auth = require("./util/Authorization");
const {
  getAllDanis,
  postDanis,
  getDani,
  postComment,
  likeDani,
  unlikeDani,
  deleteDani,
} = require("./handlers/posts");

const {
  signup,
  login,
  uploadImg,
  addUserInfo,
  getUserDetails,
  getPublicUserDetails,
  markNotificationsRead,
} = require("./handlers/users");

const { db } = require("./util/admin");

//POSTS ROUTES
app.get("/getDanis", getAllDanis);
app.post("/postDanis", Auth, postDanis);
app.get("/dani/:daniId", getDani);
app.post("/dani/:daniId/comment", Auth, postComment);
app.delete("/dani/:daniId/delete", Auth, deleteDani);
app.get("/dani/:daniId/like", Auth, likeDani);
app.get("/dani/:daniId/unlike", Auth, unlikeDani);

//USERS ROUTES
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", Auth, uploadImg);
app.post("/user", Auth, addUserInfo);
app.get("/user", Auth, getUserDetails);
app.get("/user/:handle", getPublicUserDetails);
app.post("/notifications", markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnPost = functions.firestore
  .document("danis/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`danis/${snapshot.data().daniId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().destinyHandle,
            sender: snapshot.data().userHandle,
            type: "post",
            read: false,
            daniId: doc.id,
          });
        }
      });
  });

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/danis/${snapshot.data().daniId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            daniId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });
exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/danis/${snapshot.data().daniId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            daniId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imageURL !== change.after.data().imageURL) {
      let batch = db.batch();
      return db
        .collection("danis")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const dani = db.doc(`/danis/${doc.id}`);
            batch.update(dani, { userImage: change.after.data().imageURL });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onDaniDelete = functions.firestore
  .document("/danis/{daniId}")
  .onDelete((snapshot, context) => {
    const daniId = context.params.daniId;
    const batch = db.batch();

    return db
      .collection("comments")
      .where("daniId", "==", daniId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("daniId", "==", daniId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("daniId", "==", daniId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
