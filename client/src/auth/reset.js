import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwt from "jsonwebtoken";

import Layout from "../core/layout";

import "react-toastify/dist/ReactToastify.min.css";

const Reset = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Request password reset link",
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, newPassword, buttonText } = values;

  const handleChange = (e) => {
    setValues({ ...values, newPassword: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((res) => {
        console.log({ res });
        toast.success(res.data.message);
        setValues({ ...values, buttonText: "Done" });
      })
      .catch((err) => {
        console.log({ err });
        setValues({ ...values, buttonText: "Reset password" });
        toast.error(err.response.data.error);
      });
  };

  const passwordResetForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange}
          value={newPassword}
          type="password"
          className="form-control"
          placeholder="Type new password"
          required
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Hey {name} type your new password.</h1>
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default Reset;
