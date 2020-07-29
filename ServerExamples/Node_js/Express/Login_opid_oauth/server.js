const express = require("express");
const passport = require("passport")
const OpenidConnectStrategy = require("passport-openidconnect").Strategy;
const session = require("express-session");
const app = express();

app.use(session({ 
    secret: 'SECRET', 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//google open id connectの戦略
passport.use("google-opid",new OpenidConnectStrategy({
    issuer: "https://accounts.google.com",
    authorizationURL: "https://accounts.google.com/o/oauth2/auth",
    tokenURL: "https://accounts.google.com/o/oauth2/token",
    userInfoURL: "https://www.googleapis.com/oauth2/v1/userinfo",
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:8081/opid-callback",
    scope: ["openid", "email", "profile" ]
}, function(accessToken, refreshToken, profile, done) {
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    console.log('profile: ', profile);
    return done(null, profile);
}));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/auth/google', passport.authenticate("google-opid"))

app.get('/opid-callback', (req, res) => {
    console.log("req")
    console.log(req)
    res.send('Hello World!')
})

app.listen(8081, () => console.log('Example app listening on port 8081!'))
