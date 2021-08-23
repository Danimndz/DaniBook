import axios from "axios";

export default class daniProxy {
  constructor(proxyUrl, apiUrl) {
    this.proxyUrl = proxyUrl;
    this.apiUrl = apiUrl;
  }

  //get es asincrono
  getDanis(restUrt) {
    return new Promise((resolve, reject) => {
      axios
        .get(restUrt)
        .then((danis) => {
          resolve(danis.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  loginUser(restUrt, userData) {
    return new Promise((resolve, reject) => {
      axios
        .post(restUrt, userData)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  signupUser(restUrt, NuserData) {
    return new Promise((resolve, reject) => {
      axios
        .post(restUrt, NuserData)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getUdata(restUrt) {
    return new Promise((resolve, reject) => {
      axios
        .get(restUrt)
        .then((udata) => {
          resolve(udata.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  UploadImage(restUrt, formData) {
    return new Promise((resolve, reject) => {
      axios
        .post(restUrt, formData)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getOtherUData(restUrl) {
    return new Promise((resolve, reject) => {
      axios
        .get(restUrl)
        .then((user) => {
          resolve(user.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updateUserInfo(resturl, userD) {
    return new Promise((resolve, reject) => {
      axios
        .post(resturl, userD)
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  likeDani(resturl, daniId) {
    return new Promise((resolve, reject) => {
      axios
        .get(resturl, daniId)
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  unlikeDani(resturl, daniId) {
    return new Promise((resolve, reject) => {
      axios
        .get(resturl, daniId)
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  postDani(resturl, daniData) {
    return new Promise((resolve, reject) => {
      axios
        .post(resturl, daniData)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getComments(resturl) {
    return new Promise((resolve, reject) => {
      axios
        .get(resturl)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  postComment(resturl, comment) {
    return new Promise((resolve, reject) => {
      axios
        .post(resturl, comment)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getNotification(restUrl, notificationId) {
    return new Promise((resolve, reject) => {
      axios
        .post(restUrl, notificationId)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
