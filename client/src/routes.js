import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import Signup from "./auth/signup";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
