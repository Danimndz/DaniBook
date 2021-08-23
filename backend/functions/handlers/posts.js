const { db } = require("../util/admin");
///////////////////////GET POSTS/////////////////////////////
exports.getAllDanis = (request, response) => {
  db.collection("danis")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let danis = [];
      data.forEach((doc) => {
        danis.push({
          daniId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          destinyHandle: doc.data().destinyHandle,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
        });
      });
      return response.json(danis);
    });
};

///////////////////////WRITE POSTS/////////////////////////////
exports.postDanis = (request, response) => {
  if (request.body.body.toString().trim() === "")
    return response.status(400).json({ body: "Body must not be empty" });

  const newDani = {
    body: request.body.body,
    userHandle: request.user.handle,
    destinyHandle: request.body.destinyHandle,
    userImage: request.user.imageURL,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };
  db.collection("danis")
    .add(newDani)
    .then((doc) => {
      const resDani = newDani;
      resDani.daniId = doc.id;
      response.json(resDani);
    })
    .catch((err) => {
      response.status(500).json({ error: "something went wrong" });
    });
};

///////////////////////GET POST/////////////////////////////

exports.getDani = (request, response) => {
  let daniData = {};
  db.doc(`/danis/${request.params.daniId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Dani not found" });
      }
      daniData = doc.data();
      daniData.daniId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("daniId", "==", request.params.daniId)
        .get()
        .then((data) => {
          daniData.comments = [];
          data.forEach((doc) => {
            daniData.comments.push(doc.data());
          });
          return response.json(daniData);
        })
        .catch((err) => {
          response.status(500).json({ error: err.code });
        });
    });
};

////////////////////////////CREATE COMMENT//////////////////////////////

exports.postComment = (request, response) => {
  if (request.body.body.trim() === "")
    return response.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: request.body.body,
    createdAt: new Date().toISOString(),
    daniId: request.params.daniId,
    userHandle: request.user.handle,
    userImage: request.user.imageURL,
  };
  db.collection("danis")
    .doc(request.params.daniId)
    .get()
    .then((doc) => {
      if (!doc.exists)
        return response.status(404).json({ error: "Post not found" });

      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      response.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: "Something went wrong" });
    });
};

////////////////////////////LIKE DANI//////////////////////////////

exports.likeDani = (request, response) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", request.user.handle)
    .where("daniId", "==", request.params.daniId)
    .limit(1);

  const daniDocument = db.doc(`/danis/${request.params.daniId}`);
  let daniData;

  daniDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        daniData = doc.data();
        daniData.daniId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).json({ error: "Dani not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            daniId: request.params.daniId,
            userHandle: request.user.handle,
          })
          .then(() => {
            daniData.likeCount++;
            return daniDocument.update({ likeCount: daniData.likeCount });
          })
          .then(() => {
            return response.json(daniData);
          });
      } else {
        response.status(400).json({ error: "Dani already liked" });
      }
    })
    .catch((err) => {
      response.status(500).json({ error: err.code });
    });
};

////////////////////////////UNLIKE DANI//////////////////////////////
exports.unlikeDani = (request, response) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", request.user.handle)
    .where("daniId", "==", request.params.daniId)
    .limit(1);

  const daniDocument = db.doc(`/danis/${request.params.daniId}`);

  let daniData;

  daniDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        daniData = doc.data();
        daniData.daniId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).json({ error: "Dani not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        response.status(400).json({ error: "Dani not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            daniData.likeCount--;
            return daniDocument.update({ likeCount: daniData.likeCount });
          })
          .then(() => {
            response.json(daniData);
          });
      }
    })
    .catch((err) => {
      response.status(500).json({ error: err.code });
    });
};
//////////////////////////////////////DELETE DANI////////////////////////////////////

exports.deleteDani = (request, response) => {
  const document = db.doc(`/danis/${request.params.daniId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "not found" });
      }
      if (doc.data().userHandle !== request.user.handle) {
        return response.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      response.json({ message: "Dani deleted successfully" });
    })
    .catch((err) => {
      return response.status(500).json({ error: err.code });
    });
};
