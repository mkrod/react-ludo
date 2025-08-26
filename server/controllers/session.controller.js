const jwt = require("jsonwebtoken");
const { cookieConfig } = require("../utility/cookie");

const initSession = async (req, res) =>  {
    const { player_id } = req.session;
    if (player_id) return res.json({ message: "logged_in" });
    // this place indicates that user is logged in, so no need for further sweat

    //if code reaches here, it means that user is not logged in
    const token = req.cookies?.temp_jwt;
    //console.log("Token: ", token);

    if (!token) { //meant not logged in, and no token to login
        return res.json({ error: "logged_out" });
    }

    // from here, user currently on login attempt
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store whatever you want in session
        req.session.player_id = decoded.player_id;

        // Clear the temp token
        res.clearCookie("temp_jwt", cookieConfig);
        return res.json({ message: "logged_in" });
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

module.exports = { initSession }