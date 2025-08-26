const { onlinePlayersModel } = require("../db_model/players.online");

// utility/websocket/ws_conn.js
const { Server } = require("socket.io");
const sessionMiddleware = require("../session"); // same middleware
const { createLobby, closeLobby, handleGuestJoinedLobby, removeGuestFromLobby, playerStartGame } = require("../../controllers/socket.lobby");
const { initNewGameInstance, updateDiceState } = require("../../controllers/in_game.controller");
//const onlinePlayers = new Map();


module.exports = function initWebSockets(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT,
            credentials: true
        }
    });

    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on("connection", async (socket) => {
        console.log("WS Connected:", socket.id);

        const sess = socket.request.session;
        if (sess && sess.player_id) {
            const playerIsPrevonline = await onlinePlayersModel.findOne({ player_id: sess.player_id })
            //console.log(playerIsPrevonline)
            onlinePlayersModel.updateOne({ 
                player_id: sess.player_id }, 
                { $set: { socket_id: socket.id }},
                { upsert: true })
                .then(() => {
                    console.log(`Player ${sess.player_id} saved as online`);
                })
                .catch(err => {
                    console.error(`Error saving player ${sess.player_id}:`, err);
                });
            
            //onlinePlayers.set(sess.player_id, socket.id);
            console.log(`Player ${sess.player_id} connected`);
        }

        socket.on("create_new_lobby", (data) => {
            const sess = socket.request.session;
            if (!sess || !sess.player_id) {
                return socket.emit("error", { message: "Not logged in" });
            }
            createLobby({ player_id: sess.player_id, data, socket, io });
        });
        socket.on("quit_lobby", ({ lobbyId }) => {
            const sess = socket.request.session;
            if (!sess || !sess.player_id) {
                return socket.emit("error", { message: "Not logged in" });
            }
            // Implement the logic to quit the lobby
            // For now, just acknowledge the request
            closeLobby({ player_id: sess.player_id, lobbyId, socket });
            //socket.emit("lobby_quit", { lobbyId, player_id: sess.player_id });
        });

        socket.on("joined_lobby", ({ lobby_id }) =>  {
            const sess = socket.request.session;
            if (!sess || !sess.player_id) {
                return socket.emit("error", { message: "Not logged in" });
            }

            handleGuestJoinedLobby({ lobby_id, player_id: sess.player_id, socket });
            console.log(`Guest ${sess.player_id} joined lobby ${lobby_id}`);
        });

        socket.on("remove_guest", ({ guest_id, lobby_id }) => {
            const sess = socket.request.session;
            if (!sess || !sess.player_id) {
                return socket.emit("error", { message: "Not logged in" });
            }

            removeGuestFromLobby({ guest_id, lobby_id, socket, io });
        });

        socket.on("start_game", ({ player_id, lobby_id, state }) => {
            const sess = socket.request.session;
            if (!sess || !sess.player_id) {
                return socket.emit("error", { message: "Not logged in" });
            }
            

            playerStartGame({ player_id, lobby_id, state, io });
        });

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
        socket.on("init_new_game", ({ lobby_id, player_id, data }) => {
            const sess = socket.request.session;
            if (!sess || !sess.player_id) {
                return socket.emit("error", { message: "Not logged in" });
            }

            initNewGameInstance({ lobby_id, player_id, data, io });
        });


        socket.on("update_dice_state", ({ lobby_id, player_id, data }) => {
            const sess = socket.request.session;
            if (!sess || !sess.player_id) {
                return socket.emit("error", { message: "Not logged in" });
            }
            updateDiceState({ lobby_id, player_id, data, io });
        });

        
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        socket.on("disconnect", () => {
                onlinePlayersModel.deleteMany({ socket_id: socket.id })
                    .then(() => {
                        console.log(`Player ${sess.player_id} disconnected`);
                    })
                    .catch(err => {
                        console.error(`Error removing player ${sess.player_id}:`, err);
                    });
                // Optionally, you can also remove from the Map if you are using it
                //onlinePlayers.delete(sess.player_id);
                console.log("WS Disconnected:", socket.id);
        });
    });

    return io;
};
