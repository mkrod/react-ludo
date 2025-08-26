const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");




require("dotenv").config();
const envar = process.env;

// Set the port from environment variables or default to 8000
const PORT = envar.PORT || 4000;

const app = express();


const sessionMiddleware = require("./utility/session");

app.use(sessionMiddleware);




app.use(cors({
    origin: process.env.CLIENT,
    credentials: true,
}));
app.use(express.json());

app.use(cookieParser());

//ssl
const sslOptions = {
    key: fs.readFileSync("./keys/server.key"),
    cert: fs.readFileSync("./keys/server.cert"),
};




const server = https.createServer(sslOptions, app);

require("./utility/websocket/ws_conn.js")(server);


app.get("/", (req, res) => {
    res.send("Welcome to the Ludo Server!");
});

// Serve static files from "public" folder
app.use(express.static(path.join(process.cwd(), 'public')));


app.use("/auth", require("./routes/auth.routes.js")); 
app.use("/session", require("./routes/session.routes.js"));
app.use("/user", require("./routes/user.routes.js"));
app.use("/lobby", require("./routes/lobby.route.js"));

//error handling
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception: ", err);
});
process.on("unhandledRejection", (err) => {
    console.error("unhandled Rejection: ", err);
});
process.on("uncaughtExceptionMonitor", (err) => {
    console.error("Uncaught Exception Monitor: ", err);
});

//Start the server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));