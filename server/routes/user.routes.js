const express = require("express");
const { getUserDetails, getUserLobby, getLiveLobby } = require("../controllers/user.read.controller");
const router = express.Router();



router.get("/get", getUserDetails);
router.get("/lobby/get", getUserLobby)
router.get("/lobby/live", getLiveLobby);


module.exports = router;