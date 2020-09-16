import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="text-light nav-link">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/signup" className="text-light nav-link">
          Signup
        </Link>
      </li>
    </ul>
  );
  return (
    <>
      {nav()}
      <div class="container">{children}</div>
    </>
  );
};

export default Layout;
