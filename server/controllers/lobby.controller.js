const { json } = require("express");
const { lobbyModel } = require("../utility/db_model/lobby.model");
const PlayersModel = require("../utility/db_model/players.model");
const { Player }  = require("../utility/db_model/players.model");

/**
 * Controller to get all lobbies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLobbies = async (req, res) => {
    const { player_id } = req.session;
    if (!player_id) {
        return res.json({ status: 500, message: "You are not logged in" });
    }

    try {
        const result = await lobbyModel.aggregate([
            {
                $match: { guest: { $exists: false }, state: "matchmaking" }
            },
            {
                $lookup: {
                    from: "players",                 // players collection
                    localField: "created_by",        // lobby.created_by (contains player_id)
                    foreignField: "player_id",       // players.player_id
                    as: "created_by"
                }
            },
            { $unwind: "$created_by" },
            { $sort: { created_at: -1 } }
        ]);

        //console.log("Fetched lobbies:", result);

        return res.json({ status: 200, data: result });
    } catch (err) {
        console.error("Error fetching lobbies:", err);
        return res.json({ status: 500, message: "Internal server error" });
    }
};


const joinRandomLobby = async (req, res) => {
    const { player_id } = req.session;
    const { lobby_id } =  req.body
    if (!player_id) {
        return res.json({ status: 500, message: "You are not logged in" });
    }

    const result = await lobbyModel.findOne({ lobby_id, state: "matchmaking" });
    if (!result) {
        return res.json({ status: 500, message: "Lobby not found or not in matchmaking state" });
    }
    if (result.guest) {
        return res.json({ status: 500, message: "Lobby already has a guest" });
    }
    try {
        const lobbyCreator = await PlayersModel.findOne({ player_id: result.created_by });
        if (!lobbyCreator) {
            return res.json({ status: 500, message: "Lobby creator not found" });
        }
        const thisGuest = await PlayersModel.findOne({ player_id });
        if (!thisGuest) {
            return res.json({ status: 500, message: "You are not a valid player" });
        }
        await lobbyModel.updateOne(
            { lobby_id },
            { $set: { 
                guest: player_id, 
                players: [
                    {
                        name: lobbyCreator.name,
                        id: lobbyCreator.player_id,
                        avatar: lobbyCreator.avatar || undefined, // Assuming avatar is stored in PlayersModel
                        data: [{ score: 0, turn: false }] // Initialize player data
                    },
                    {
                        name: thisGuest.name,
                        id: thisGuest.player_id,
                        avatar: thisGuest.avatar || undefined, // Assuming avatar is stored in PlayersModel
                        data: [{ score: 0, turn: false }] // Initialize player data
                    }

                ]
            } }
        );

        console.log(`Player ${player_id} joined lobby ${lobby_id}`);
        return res.json({ status: 200, message: "Joined lobby successfully", data: { player_id } });
    } catch (err) {
        console.error("Error joining lobby:", err);
        return res.json({ status: 500, message: "Internal server error" });
    }

}

const getLobbyForHost = async (req, res) => {
    const { player_id } = req.session;
    //console.log("now fetching lobby for host");

    if(!player_id) return res.json({ status: 500, message: "Not Logged In"});

    const result = await lobbyModel.findOne({ created_by: player_id });
    if(!result) return res.json({ status: 500, message: "You are not in a lobby as host" });


    res.json({ status: 200, message: "success", data: result.toObject() })
}

const getLobbyForGuest = async (req, res) => {
    const { player_id } = req.session;
    //console.log("now fetching lobby for guest");

    if(!player_id) return res.json({ status: 500, message: "Not Logged In"});

    const result = await lobbyModel.findOne({ guest: player_id });
    if(!result) return res.json({ status: 500, message: "You are not in a lobby as guest" });


    res.json({ status: 200, message: "success", data: result.toObject() })
}

module.exports = { getLobbies, joinRandomLobby, getLobbyForHost, getLobbyForGuest };
