import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import Layout from "../core/Layout";

import "react-toastify/dist/ReactToastify.min.css";

const Signup = () => {
  const [values, setValues] = useState({
    name: "Sergey",
    email: "komarovs33@mail.ru",
    password: "1234",
    buttonText: "Submit",
  });

  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    //
  };

  const clickSubmit = (event) => {
    //
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control"
        />
      </div>

      <div>
        <button className="btn btn-primary" obClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Signup</h1>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
