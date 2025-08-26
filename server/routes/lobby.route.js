const express = require("express");
const router = express.Router();
const { getLobbies, joinRandomLobby, getLobbyForHost, getLobbyForGuest } = require("../controllers/lobby.controller");

// Route to get all lobbies
router.get("/all_rooms", getLobbies);
router.post("/join_random", joinRandomLobby);
router.get("/get_host_lobby", getLobbyForHost);
router.get("/get_guest_lobby", getLobbyForGuest);


module.exports = router;