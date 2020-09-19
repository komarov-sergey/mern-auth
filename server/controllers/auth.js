const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");

const mailjet = require("node-mailjet").connect(
  process.env.MAIL_TOKEN1,
  process.env.MAIL_TOKEN2
);

const User = require("../models/user");

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec(async (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    try {
      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_FROM,
              Name: "Sergey",
            },
            To: [
              {
                Email: email,
                Name: "Sergey",
              },
            ],
            Subject: "Account activation link",
            HTMLPart: `
            <h1>Please use the following link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `,
            CustomID: "AppGettingStartedTest",
          },
        ],
      });
      return res.json({
        message: `Email has been sent to ${email}. Follow the instraction to activate your account.`,
      });
    } catch (e) {
      console.log({ e });
      return res.json({
        message: e.message,
      });
    }
  });
};

exports.accountActivation = async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      await jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    } catch (e) {
      console.log({ e });
      return res.status(401).json({ error: "Expired link. Signup again" });
    }

    const { name, email, password } = jwt.decode(token);

    const user = new User({ name, email, password });

    try {
      await user.save();
    } catch (e) {
      console.log({ e });
      return res
        .status(401)
        .json({ error: "Error saving user in database. Try signup again" });
    }
    return res.json({
      message: "Signup success. Please signin.",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user === null) {
      return res
        .status(400)
        .json({ error: "User with that email does not exist. Please signup" });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "Email and password do not match" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // const { _id, name, email, role } = user;

    return res.json({
      token,
      user,
    });
  } catch (e) {
    console.log(2);
    return res
      .status(400)
      .json({ error: "User with that email does not exist. Please signup" });
  }
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user._id
  algorithms: ["HS256"],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(400).json({ error: "Admin resourse. Access denied." });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, async (err, user, res) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with that email does not exist" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    return user.updateOne(
      { resetPasswordLink: token },
      async (err, success, res) => {
        if (err) {
          console.log({ err });
          return res.status(400).json({
            error: "Database connection error on user password forgot request",
          });
        } else {
          try {
            await mailjet.post("send", { version: "v3.1" }).request({
              Messages: [
                {
                  From: {
                    Email: process.env.EMAIL_FROM,
                    Name: "Sergey",
                  },
                  To: [
                    {
                      Email: email,
                      Name: "Sergey",
                    },
                  ],
                  Subject: "Password reset link",
                  HTMLPart: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
                `,
                  CustomID: "AppGettingStartedTest",
                },
              ],
            });
            return res.json({
              message: `Email has been sent to ${email}. Follow the instraction to activate your account.`,
            });
          } catch (e) {
            console.log({ e });
            return res.json({
              message: e.message,
            });
          }
        }
      }
    );
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: "Expired link. Try again",
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "Something went wrong. Try later",
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password",
            });
          }
          res.json({
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    });
  }
};
