//const lobbies = new Map();
const crypto = require("crypto");
const { onlinePlayersModel } = require("../utility/db_model/players.online");
const { lobbyModel } = require("../utility/db_model/lobby.model");
const PlayersModel = require("../utility/db_model/players.model");

const createLobby = async ({ player_id, socket }) => {
    const lobbyId = `lobby_${crypto.randomUUID()}`;
    const created_at = new Date().toISOString();


    const result = await lobbyModel.findOne({ created_by: player_id });
    const username = await PlayersModel.findOne({ player_id })
    if(result) return;
    lobbyModel.insertOne({
        lobby_id: lobbyId,
        created_by: player_id,
        created_at,
        players: [
            { name: username.toObject().username || "", id: player_id, data: []}
          ],
        state: "matchmaking"
    })
    .then(() => {
        setTimeout(() => {
            socket.emit("lobby_created", { lobbyId, player_id })
            
            //tell all  online players that the lobby is changed
            socket.broadcast.emit("lobby_changed");
        }, 3000);
        console.log(`${lobbyId} => created by player => ${player_id}`);

    })
    .catch((err) => console.log("Cannot create lobby: ", err));
};

const closeLobby = async ({ player_id, lobbyId, socket }) => {

    try{

        //first send socket to players in the lobby , so i can remove them. 
        const created_by = player_id;
        const lobby_id = lobbyId;
        const theLobby = await lobbyModel.findOne({ created_by, lobby_id });
        if(!theLobby) return;
        
        const theGuestId = theLobby.guest ?  theLobby.guest : undefined;
        if(!theGuestId){
            await lobbyModel.deleteMany({ created_by });
            socket.emit("lobby_closed");
            
            //tell all  online players that the lobby is closed
            socket.broadcast.emit("lobby_changed", { lobby_id, created_by });


        }else{
            const theGuestSocketId = await onlinePlayersModel.findOne({ player_id: theGuestId });
            if(theGuestSocketId){
                socket.to(theGuestSocketId.socket_id).emit("lobby_closed");
            }
            await lobbyModel.deleteMany({ created_by });
            socket.emit("lobby_closed");
            //tell all  online players that the lobby is closed
            socket.broadcast.emit("lobby_changed", { lobby_id, created_by });
        }

    }catch(err){
        console.log("Error Closing lobby: ", err);
    }


}


const handleGuestJoinedLobby = async ({ lobby_id, player_id, socket }) => {
    //console.log("Trying to reach host");
    try {
        const lobby = await lobbyModel.findOne({ lobby_id  });
        if (!lobby){
            console.log("Lobby not found")
            return socket.emit("error", { message: "Lobby not found" });
        }

        const lobbyCreator = await onlinePlayersModel.findOne({ player_id: lobby.created_by });
        if (!lobbyCreator) {
            console.log("Lobby creator not found")
            return socket.emit("error", { message: "Lobby creator not found" });
        }
        const thisGuest = await onlinePlayersModel.findOne({ player_id });
        if (!thisGuest) {
            console.log("Guest is not a valid player")
            return socket.emit("error", { message: "You are not a valid player" });
        }

        /*if (lobby.guest) {
            console.log("Guest is not a valid player")
            return socket.emit("error", { message: "Lobby already has a guest" });
        }  */ 

        //emit to both players that a guest has joined
        //socket.to(thisGuest.socket_id).emit("guest_joined_lobby");

        console.log("Emitting guest_joined_lobby to lobby creator now");
        socket.to(lobbyCreator.socket_id).emit("guest_joined_lobby");
        console.log("Emitted guest_joined_lobby to lobby creator");
    }catch(err){
        console.error("Error finding lobby:", err);
        return socket.emit("error", { message: "Internal server error" });
    }
}


const removeGuestFromLobby = async ({ guest_id, lobby_id, socket, io }) => {
    //console.log("Removing guest from lobby: ", guest_id);
    //console.log("removeGuestFromLobby got io:", !!io);

    //remove guest and
    //1. emit to both of them that lobby_changed seems, there is a listener which is apppropriate
    //2. broadcast to all client that lobby change so the lobby cann be included in their search as hot pug 
    try{
        const res = await lobbyModel.findOne({ lobby_id });
        const lobby = res.toObject();

        const result = await lobbyModel.updateOne({ lobby_id }, {
            $set: {
                players: lobby.players.filter(player => player.id !== guest_id),
                state: "matchmaking"
            },
            $unset: {
                guest: "",
            }
        });

        if(!result) return socket.emit("error");
        //console.log("Guest is removed, sending notifications...");
        const creator = (await onlinePlayersModel.findOne({ player_id: lobby.created_by })).toObject();
        //socket.to(creator.socket_id).emit("ready_state_change"); //this event already has an appropriate handler on the host side;
        setTimeout(() => io.to(creator.socket_id).emit("guest_joined_lobby"), 1000); //this event already has an appropriate handler on the host side;
        //console.log("Guest is removed, notified host...");

        const guest = (await onlinePlayersModel.findOne({ player_id: guest_id })).toObject();
        //console.log("Guest socket id: ", guest.socket_id);
        if(!guest.socket_id) return console.log("Guest socket id is not found, cannot notify guest");
        //socket.to(guest.socket_id).emit("ready_state_change"); //this event already has an appropriate handler on the host side;
        setTimeout(() => io.to(guest.socket_id).emit("guest_joined_lobby"), 100); //this event already has an appropriate handler on the host side;
        //console.log("Guest is removed, notified guest...");

    }catch(err){
        console.log("Error removing guest");
    }
}

const playerStartGame = async ({ player_id, lobby_id, state, io }) =>  {

    const updatedLobby = (await lobbyModel.findOneAndUpdate(
        { lobby_id, "players.id": player_id },
        { $set: { "players.$.ready_state": state } },
        { new: true } // return the updated doc
    ))?.toObject();
    
    if (!updatedLobby) {
        console.log("Lobby not found or player not in lobby");
        return;
    }

    //notify the room that a player has changed his ready state
    //if both players are ready, start the game by emitting start_game event to both players
    const players = updatedLobby.players;
    const allReady = players.every(p => p.ready_state === "ready");
    console.log("All players ready: ", allReady);


    //emit ready_state_change to both players
    players.forEach(async (p) => {
        const playerOnline = await onlinePlayersModel.findOne({ player_id: p.id });
        if(playerOnline && playerOnline.socket_id){
            io.to(playerOnline.socket_id).emit("ready_state_change", { lobby_id, player_id: p.id, state });
        }
    });
    console.log("Notified players of ready state change in lobby: ", lobby_id);


    if(allReady){
        //update the lobby state to in_game
        await lobbyModel.updateOne({ lobby_id }, { $set: { state: "in_game" } });
        //emit start_game to both players
        players.forEach(async (p) => {
            const playerOnline = await onlinePlayersModel.findOne({ player_id: p.id });
            if(playerOnline && playerOnline.socket_id){
                io.to(playerOnline.socket_id).emit("start_game", { lobby_id, player_id: p.id });
            }
        });
        console.log("Game started for lobby: ", lobby_id);
    }

}

module.exports = { 
    createLobby,
    closeLobby, 
    handleGuestJoinedLobby, 
    removeGuestFromLobby, 
    playerStartGame
}