import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import Layout from "../core/layout";

import "react-toastify/dist/ReactToastify.min.css";
const Private = () => {
  const [values, setValues] = useState({
    role: "",
    name: "Sergey",
    email: "komarovs33@mail.ru",
    password: "123456",
    buttonText: "Submit",
  });

  const { role, name, email, password, buttonText } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();

    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((res) => {
        console.log({ res });
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submited",
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(err.response.data.error);
      });
  };

  const updateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Role</label>
        <input defaultValue={role} type="text" className="form-control" />
      </div>
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
        <input defaultValue={email} type="email" className="form-control" />
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
        <h1 className="pt-5 text-center">Private</h1>
        <p className="lead text-center">Profile update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Private;
