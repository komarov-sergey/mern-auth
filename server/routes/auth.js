const express = require("express");

const { signup, accountActivation } = require("../controllers/auth");
const { userSignupValidator } = require("../validators/auth");
const { runValidation } = require("../validators");

const router = express.Router();

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);

module.exports = router;
