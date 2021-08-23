import React, { Component } from "react";
import "../assets/css/dark_blue_adminux.css";
import "../assets/css/font-awesome.min.css";
//Redux
import { connect } from "react-redux";
import { SignUpuser } from "../Redux/Actions/user_actions";

import PropTypes from "prop-types";

export class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      uname: "",
      password: "",
      cpassword: "",
      errors: {},
    };
  }

  handleSubmit = (event) => { 
    event.preventDefault();
    const NuserData = {
      email: this.state.email,
      handle: this.state.uname,
      password: this.state.password,
      confirmPass: this.state.cpassword,
    };
    this.props.SignUpuser(NuserData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    // const {
    //   UI: { loading },
    // } = this.props;
    return (
      <div className="wrapper-content-sign-in firstDiv">
        <div className="container text-center">
          <form
            noValidate
            onSubmit={this.handleSubmit}
            className="form-signin1 smallbox"
          >
            <h2 className="tex-black mb-4">Sign-up!</h2>
            Email
            <label className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Email address"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            ></input>
            Username
            <label className="sr-only">Username</label>
            <input
              id="uname"
              type="uname"
              className="form-control"
              placeholder="username"
              name="uname"
              value={this.state.uname}
              onChange={this.handleChange}
            ></input>
            Password
            <label className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            ></input>
            Confirm password
            <label className="sr-only">Password</label>
            <input
              id="cpassword"
              type="password"
              className="form-control"
              placeholder="Confirm password"
              name="cpassword"
              value={this.state.cpassword}
              onChange={this.handleChange}
            ></input>
            <button className="btn btn-lg btn-primary btn-round">Signup</button>
          </form>
        </div>
      </div>
    );
  }
}

signup.propTypes = {
  SignUpuser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  SignUpuser,
};

export default connect(mapStateToProps, mapActionsToProps)(signup);
