const express = require("express");

const { read, update } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get("/user/:id", requireSignin, read);
router.put("/user/update/:id", requireSignin, update);

module.exports = router;
