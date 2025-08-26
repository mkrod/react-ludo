const { mongoose } = require("../db");

const onlinePlayerSchema = new mongoose.Schema({
    player_id: String,
    socket_id: String,
});

const onlinePlayersModel = mongoose.model("onlinePlayers", onlinePlayerSchema);

module.exports = { onlinePlayersModel };

