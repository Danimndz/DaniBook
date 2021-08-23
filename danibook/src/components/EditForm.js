import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import "../assets/css/dark_blue_adminux.css";
import "../assets/css/font-awesome.min.css";

class EditForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="edit-profile-container">
        <form onSubmit={handleSubmit}>
          <h2>Bio:</h2>
          <Field
            name="bio"
            className="form-control"
            component="input"
            type="text"
          />
          <h2>Website:</h2>
          <Field
            name="website"
            className="form-control"
            component="input"
            type="text"
          />
          <h2>Location:</h2>
          <Field
            name="location"
            className="form-control"
            component="input"
            type="text"
          />
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </form>
      </div>
    );
  }
}

const EditProfileForm = reduxForm({
  form: "EditProfileForm",
})(EditForm);

export default EditProfileForm;
