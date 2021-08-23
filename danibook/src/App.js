import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import jwtDecode from "jwt-decode";
//redux:
import {
  logoutUser,
  getUserData,
  setAuthenticated,
} from "./Redux/Actions/user_actions";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

// Pages:
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import Profiles from "./pages/Profiles";
import Authroute from "./components/Authroute";
import HomeRoute from "./components/HomeRoute";
import axios from "axios";
import Postcard from "./components/Postcard";

axios.defaults.baseURL =
  "https://us-central1-danibook-983c2.cloudfunctions.net/api";
class App extends React.Component {
  componentDidMount() {
    const token = localStorage.IdToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        this.props.logoutUser();
        window.location.href = "/login";
      } else {
        this.props.setAuthenticated();
        axios.defaults.headers.common["Authorization"] = token;
        this.props.getUserData();
      }
    }
  }
  render() {
    const {
      user: { userData: handle },
    } = this.props;
    return (
      <Router>
        <div className="container">
          <Switch>
            <HomeRoute exact path="/" component={home} />
            <HomeRoute
              exact
              path={"/profile/:" + handle}
              component={Profiles}
            />
            <Authroute exact path="/login" component={login} />
            <Authroute exact path="/signup" component={signup} />
            <HomeRoute
              exact
              path="/user/:handle/dani/:daniId"
              component={Postcard}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  getUserData,
  logoutUser,
  setAuthenticated,
};
export default connect(mapStateToProps, mapActionsToProps)(App);
