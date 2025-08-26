const express = require("express");
const router = express.Router();
const { initSession } = require("../controllers/session.controller")


router.get("/init", initSession)

module.exports = router;