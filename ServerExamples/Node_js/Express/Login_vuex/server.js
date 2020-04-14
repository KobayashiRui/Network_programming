const express = require("express");
const session = require("express-session");
const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie:{ 
        maxAge:1000 * 60 * 60
    }
}));
// ログイン画面でフォームを利用するため

app.use("/",require("./router.js"));

app.listen(8082);