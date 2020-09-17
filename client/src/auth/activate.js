import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwt from "jsonwebtoken";

import Layout from "../core/layout";

import "react-toastify/dist/ReactToastify.min.css";

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  const { name, token, show } = values;

  useEffect(() => {
    let token = match.params.token;
    console.log(11);
    console.log({ token });
    console.log(jwt.decode(token));
    let { name } = jwt.decode(token);

    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const clickSubmit = (e) => {
    e.preventDefault();

    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((res) => {
        console.log({ res });
        setValues({
          ...values,
          show: false,
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        toast.error(err.response.data.error);
      });
  };

  const activationLink = () => (
    <div className="text-center">
      <h1 className="p-5">Hey {name}, Ready to activate your account</h1>
      <button className="btn btn-outline-primary" onClick={clickSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Activate Account</h1>
        {activationLink()}
      </div>
    </Layout>
  );
};

export default Activate;
