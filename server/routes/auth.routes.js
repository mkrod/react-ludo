const express = require("express");
const { mkGameoCallback } = require("../controllers/auth.controller");
const router = express.Router();


router.get("/mkgameo/callback", mkGameoCallback);



module.exports = router;