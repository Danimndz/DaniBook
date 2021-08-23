import React, { Component } from "react";
import "../assets/css/dark_blue_adminux.css";
import "../assets/css/font-awesome.min.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
//Redux
import { connect } from "react-redux";
import { loginUser } from "../Redux/Actions/user_actions";


class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value, //cada name corresponda a value
    });
  };

  render() {

    return (
      <div className="wrapper-content-sign-in firstDiv">
        <div className="container text-center">
          <form
            noValidate
            onSubmit={this.handleSubmit}
            className="form-signin1 smallbox"
          >
            <h2 className="tex-black mb-4">Login</h2>
            email
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
            password
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
            <button className="btn btn-lg btn-primary btn-round">login</button>
          </form>
          <p className="mt-3">
            Dont have account yet?
            <Link to="/signup">Signup here</Link>!
          </p>
        </div>
      </div>
    );
  }
}

login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(mapStateToProps, mapActionsToProps)(login);
