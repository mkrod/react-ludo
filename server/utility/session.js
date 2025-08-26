// utility/session.js
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config();
const envar = process.env;

const sessionMiddleware = session({
    name: "_ludo_one_session",
    secret: "ludo-your-secret-key-default", // must match in all uses
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: envar.MONGO_URI || "mongodb://localhost:27017/mk_ludo_session"
    }),
    cookie: {
        secure: true,
        sameSite: "none"
    }
});

module.exports = sessionMiddleware;
