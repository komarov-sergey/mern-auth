import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import Layout from "../core/layout";

import "react-toastify/dist/ReactToastify.min.css";

const Forgot = ({ history }) => {
  const [values, setValues] = useState({
    email: "komarovs33@mail.ru",
    buttonText: "Request password reset link",
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then((res) => {
        console.log({ res });
        toast.success(res.data.message);
        setValues({ ...values, buttonText: "Requested" });
      })
      .catch((err) => {
        console.log({ err });
        setValues({ ...values, buttonText: "Request password reset link" });
        toast.error(err.response.data.error);
      });
  };

  const passwordForgotForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
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
        <h1 className="p-5 text-center">Forgot password</h1>
        {passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default Forgot;
