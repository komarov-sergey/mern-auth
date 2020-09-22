import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./app";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import Activate from "./auth/activate";
import Private from "./core/private";
import Admin from "./core/admin";
import PrivateRoute from "./auth/private-route";
import AdminRoute from "./auth/admin-route";
import Forgot from "./auth/forgot";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/auth/activate/:token" component={Activate} />
        <PrivateRoute path="/private" component={Private} />
        <AdminRoute path="/admin" component={Admin} />
        <Route path="/auth/password/forgot" component={Forgot} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
