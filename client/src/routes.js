import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./app";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import Activate from "./auth/activate";
import Private from "./core/private";
import PrivateRoute from "./auth/private-route";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/auth/activate/:token" component={Activate} />
        <PrivateRoute path="/private" component={Private} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
