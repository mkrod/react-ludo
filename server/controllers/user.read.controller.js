const { lobbyModel } = require("../utility/db_model/lobby.model");
const playersModel = require("../utility/db_model/players.model");



const getUserDetails = async (req, res) => {
    const { player_id } = req.session;
    if(!player_id) return res.json({ message: "No User Logged In", data: {}});

    const data = await playersModel.findOne({ player_id });
    return res.json({ message: "success", data});
}


const getUserLobby = async (req, res) => {
    const { player_id } = req.session;
    if(!player_id) return res.json({ message: "No User Logged In", data: {}});

    const result = await lobbyModel.find({
        $or: [
          { created_by: player_id },
          { guest: player_id }
        ]
      }).sort({ _id: -1 }); //latest lobby by the player
    const existingLobby = result[0];
    if(!existingLobby) return res.json({ message: "no", data: {}});
    const newData = {...existingLobby.toObject(), isPlayer: existingLobby.created_by === player_id};
    //console.log("Existing lobbies: ", result);
    //console.log("last lobby: ", newData);
    if(existingLobby.state !== "in_game"){
        //check if it is not more than 10 minutes old and 
        const created =  new Date(existingLobby.created_at);
        const diff = Date.now() - created.getTime();
        const isWithin10Min = diff <= 10 * 60 * 1000;
        if(isWithin10Min) return res.json({ message: "yes", data: { existingLobby: newData }});

    }else{
        //check if its not more than 5hours i`ll adjust the time later after i get a moderate calculation of avg gametime
        const created =  new Date(existingLobby.created_at);
        const diff = Date.now() - created.getTime();
        const isWithin5hr = diff <= 5 * 60 * 60 * 1000;
        if(isWithin5hr) return res.json({ message: "yes", data: { existingLobby }});
    }

    await lobbyModel.deleteMany({ created_by: player_id })
    return res.json({ message: "no", data: {}});
}

const getLiveLobby = async (req, res) => {
    const { player_id } = req.session;
    if(!player_id) return res.json({ message: "No User Logged In", data: {}});

    const result = await lobbyModel.find({
        $or: [
          { created_by: player_id },
          { guest: player_id }
        ]
      }).sort({ _id: -1 }); //latest lobby by the player
      const lobby = (result[0]).toObject();
      if(!lobby) return res.json({ status: 404, message: "not found" });
      return res.json({ status: 200, message: "ok", data: lobby });
}

module.exports = { getUserDetails, getUserLobby, getLiveLobby }