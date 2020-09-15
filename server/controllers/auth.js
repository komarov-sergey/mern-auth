const jwt = require("jsonwebtoken");

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
