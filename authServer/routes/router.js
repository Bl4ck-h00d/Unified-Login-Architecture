const express = require("express");

const router = express.Router();
const controller = require("../controller");

router.route("/login").get(controller.login).post(controller.getLogin);

router.get("/verifytoken", controller.verifyAuthToken);

module.exports = router;
