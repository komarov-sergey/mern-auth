const User = require("../models/user");

// exports.signup = (req, res) => {
//   // console.log("req body on signup", req.body);

//   const { name, email, password } = req.body;

//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "Email is taken",
//       });
//     }
//   });

//   let newUser = new User({ name, email, password });
//   newUser.save((err, success) => {
//     if (err) {
//       console.log("signup error: ", err);
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     return res.json({
//       message: "Signup success! Please signin",
//     });
//   });
// };

exports.signup = (req, res) => {};
