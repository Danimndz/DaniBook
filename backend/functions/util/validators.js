const isEmpty = (str) => {
  if (str.trim() === "") return true;
  else return false;
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validateSignUpData = (data) => {
  let sprError = {};
  ///EMAIL VALIDATION/////////////////
  if (isEmpty(data.email)) sprError.email = "Must not be empty";
  else if (!isEmail(data.email))
    sprError.email = "Must be a valid email address";

  ///PASS VALIDATION//////////////////
  if (isEmpty(data.password)) sprError.password = "Must not be empty";
  if (data.password !== data.confirmPass)
    sprError.confirmPass = "Passwords must match";
  ///HANDLE VALIDATION///////////////
  if (isEmpty(data.handle)) sprError.handle = "Must not be empty";

  return {
    sprError,
    valid: Object.keys(sprError).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.checkExtraUserData = (data) => {
  let userExtraData = {};
  if (!isEmpty(data.bio.trim())) userExtraData.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      // https:// 0='h', 4='p'
      userExtraData.website = `http://${data.website.trim()}`;
    } else userExtraData.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userExtraData.location = data.location;
  console.log(userExtraData);
  return userExtraData;
};
