require("../utility/db");
const { cookieConfig } = require("../utility/cookie");
const Player = require("../utility/db_model/players.model");
const jwt = require("jsonwebtoken"); 

const mkGameoCallback = async (req, res) => {
    
    const { access_token } = req.query;

    if (!access_token) {
        return res.status(400).json({ error: "Access token is required" });
    }

    // Here you would typically handle the access token, e.g., save it to the database or use it to fetch user data
    //console.log("Received access token:", access_token);

    try{
        const url = "http://localhost:8000/api/oauth/user/info"; // Example endpoint, replace with actual MKGameO API endpoint
        const response = await fetch(url , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token })
        });

        const data = await response.json()
        
        

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "An error occurred"}) 
        }

        const player = await Player.findOne({ player_id: data.user.user_id });
        //console.log("player: ", player);
                if (!player) {
                    const newPlayer = new Player({
                        player_id: data.user.user_id,
                        name: data.user.name,
                        username: data.user.username,
                        email: data.user.email,
                        auth: "mkgameo"
                    });
                    const result = await newPlayer.save();
                    if (!result) {
                        return res.status(500).json({ error: "Failed to create new player" });
                    }
                    const player_id = result.player_id;
                    const tempToken = jwt.sign(
                        { player_id },
                        process.env.JWT_SECRET,
                        { expiresIn: "2m" } // short-lived
                    );


                    
                    res.cookie("temp_jwt", tempToken, cookieConfig);
                    return res.redirect(process.env.CLIENT);
                }

        const player_id = player.player_id;
        const tempToken = jwt.sign(
            { player_id },
            process.env.JWT_SECRET,
            { expiresIn: "2m" } // short-lived
        );



        res.cookie("temp_jwt", tempToken, cookieConfig);
        res.redirect(process.env.CLIENT);

    }catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: "Failed to fetch user info" });
    }
}



module.exports = { mkGameoCallback }