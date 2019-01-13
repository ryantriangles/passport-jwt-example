const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./auth");

const app = express();
app.use(bodyParser.json({ type: "*/*" }));

app.get("/signup", auth.signUp);
app.get("/login", auth.requireSignin, auth.sendToken);
app.get("/dashboard", auth.requireAuth, (req, res) => res.send("Welcome"));

app.listen(3780);
