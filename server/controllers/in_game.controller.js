const { onlinePlayersModel } = require("../utility/db_model/players.online");

//add player turn field to lobby documnent
//each player will send their seed data
//and also the dice state to avoid player cheat of re-rolling the dice on page refresh. 
//then, add it to the player object in the players array
//emit a in_game_data_changed to the client and run the same handler of ready_state_change in the client

const { lobbyModel } = require("../utility/db_model/lobby.model");
const { Socket } = require("socket.io");

const initNewGameInstance = async ({ lobby_id, player_id, data, io }) => {
    console.log(data);
    //if the player refresh the page, this will run again so just return if players.some((p) => p.data) or something
    //it means the player have an instance initiated already
    const result = (await lobbyModel.findOne({
        $or: [
          { created_by: player_id },
          { guest: player_id }
        ]
      })).toObject();

    if (result.players.every((p) => p.in_game_state.length > 0)) {
        result.players.forEach(async (player) => {
            const playerSocket = (await onlinePlayersModel.findOne({ player_id: player.id })).toObject().socket_id;
            if (playerSocket) {
                io.to(playerSocket).emit("new_move", { player });
            };
        })

        return;
    }//game already initiated
    const availableColors = data.colors;
    const inGameController = new InGameController(initNewGameInstance);
    const in_game_state = inGameController.chooseColorInstance(availableColors);

    const updated = await lobbyModel.findOneAndUpdate(
        { lobby_id: lobby_id, "players.id": player_id },
        { $set: { 
            "players.$.in_game_state": in_game_state, 
            "players.$.data": [{ score: 0, turn: false, dice: [] }],
            last_played: result.guest, // so host will play first
        }},
        { new: true }
    ).lean();

    
    updated.players.forEach(async (player) => {
        const playerSocket = (await onlinePlayersModel.findOne({ player_id: player.id })).toObject().socket_id;
        if (playerSocket) {
            io.to(playerSocket).emit("new_move", { player });
        };
    })
    return { updated };
}


const updateDiceState = async ({ lobby_id, player_id, data, io }) => {
    console.log(data);
    const result = await lobbyModel.findOneAndUpdate(
        { lobby_id: lobby_id, "players.id": player_id },
        { $set: { "players.$.data.0.dice": data } },
        { new: true }
    ).lean();

    result.players.forEach(async (player) => {
        const playerSocket = (await onlinePlayersModel.findOne({ player_id: player.id })).toObject().socket_id;
        if (playerSocket) {
            io.to(playerSocket).emit("new_move", { player });
        };
    })
    return { result };
      
}

const updateGameState = async ({ lobby_id, player_id, data }) => {
    console.log(data);
    const lobby = (await lobbyModel.findOne({ lobby_id })).toObject();
    if(lobby.last_played === player_id) return io.emit("error", { message: "You cannot play right now" });
    //validation done, proceed


}










//next step not here necessarily
//make sure that its the position of the in_game_state thats mapped to the pot seed 
//make it work somehow







class InGameController {
    constructor(initNewGameInstance) {
        this.initNewGameInstance = initNewGameInstance;
    }

    initSeedInstance() {
        return [
            {
                id: "1",
                state: "home",
            },
            {
                id: "2",
                state: "home",
            },
            {
                id: "3",
                state: "home",
            },
            {
                id: "4",
                state: "home",
            },
        ];
    }

    chooseColorInstance(availableColors) {
        return availableColors.map((color) => ({
            color: color,
            seeds: this.initSeedInstance(),
        }));
    }
}


module.exports = { initNewGameInstance, updateGameState, updateDiceState }