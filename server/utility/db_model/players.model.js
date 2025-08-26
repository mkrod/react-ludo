const { mongoose } = require("../db");

const playerSchema = new mongoose.Schema({
    player_id: String,
    name: String,
    username: String,
    email: String,
    data: Array,
    password: String,
    auth: String
});

const PlayersModel = mongoose.model("players", playerSchema);
module.exports = PlayersModel;

