import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuth } from "./helpers";

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log(`PrivateRoute ${JSON.stringify(isAuth())}`);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
