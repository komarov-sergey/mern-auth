import React from "react";
import axios from "axios";
import GoogleLogin from "react-google-login";

import { authenticate, isAuth } from "./helpers";

const Google = ({ informParent = (f) => f }) => {
  const responseGoogle = (res) => {
    console.log(res.tokenId);

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: res.tokenId },
    })
      .then((res) => {
        console.log("GOOGLE SIGNIN SUCCESS", res);
        // inform parent component
        informParent(res);
      })
      .catch((e) => console.log({ e }));
  };

  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="btn btn-danger btn-lg btn-block"
          >
            <i className="fab fa-google pr-2"></i> Login with Google
          </button>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default Google;
