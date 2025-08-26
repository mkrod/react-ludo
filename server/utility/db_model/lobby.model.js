const { mongoose } = require("../db");


const seedSchema = new mongoose.Schema({
    id: { type: String },
    state: { type: mongoose.Schema.Types.Mixed } // can be number or string
    // OR better: { type: String, enum: ["home", "out"] } if only strings allowed
    // OR a union-like workaround with Mixed if both Number and String are needed
});

const diceSchema = new mongoose.Schema({
    id: String,
    number: Number,
})

const playerDataSchema = new mongoose.Schema({
    score: { type: Number },
    turn: { type: Boolean },
    dice: [diceSchema],
});


const inGameState = new mongoose.Schema({ 
    color: { type: String },
    seeds: [seedSchema],
});

const lobbySchema = new mongoose.Schema({
    lobby_id: { type: String },
    created_by: { type: String },
    guest: { type: String },
    created_at: { type: String },
    players: [{ 
        name: { type: String },
        id: { type: String },
        ready_state: { type: String },
        avatar: { type: String },
        data: [playerDataSchema],
        in_game_state: [inGameState],
    }],
    state: { type: String },
    last_played: { type: String }
});

const lobbyModel = mongoose.model("lobbies", lobbySchema, "lobbies");

module.exports = { lobbyModel };
