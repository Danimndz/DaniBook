import React from "react";
import { Route, Redirect } from "react-router-dom";

const HomeRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
        localStorage.getItem('IdToken') !== null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
    }
  />
);

export default HomeRoute;
