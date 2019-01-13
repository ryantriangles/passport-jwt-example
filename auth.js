const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const jwt = require("jwt-simple");
const db = require("./database");

// Generate a JSON Web Token from a user object (requiring only an `id` field)
const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, "no homers");
};

// Given a request with an `email` and `password` on the body, add the user to
// the mock database and send back a JSON response with only a `token` field.
// Sends back a 422 if the email is already in use.
const signUp = (req, res, next) => {
  if (db.find.email(req.body.email))
    return res.status(422).send({ error: "Email in use" });
  const user = {
    id: db.length() + 1,
    email: req.body.email,
    password: req.body.password
  };
  db.add(user);
  res.json({ token: tokenForUser(user) });
};

// Set up a local login strategy, taking an email and a pasword.
const localOpt = { usernameField: "email" };
const localLogin = new LocalStrategy(localOpt, function(email, password, done) {
  const user = db.find.email(email);
  if (!user) return done(null, false);
  if (user.password !== password) return done(null, false);
  done(null, user);
});
passport.use(localLogin);

// Set up a JWT login strategy, assuming the user's ID is in the token and that
// the token is in the `authorization` header.
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: "no homers"
};
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  done(null, db.find.id(payload.sub) || false);
});
passport.use(jwtLogin);

// Middleware to require a valid JWT token.
const requireAuth = passport.authenticate("jwt", { session: false });

// Middleware to require a valid email address and password.
const requireSignin = passport.authenticate("local", { session: false });

// Middleware that sends a JSON response containing a new JSON Web Token to the
// user.
const sendToken = (req, res) => res.send({ token: tokenForUser(req.user) });

module.exports = {
  requireSignin,
  requireAuth,
  sendToken,
  signUp
};
