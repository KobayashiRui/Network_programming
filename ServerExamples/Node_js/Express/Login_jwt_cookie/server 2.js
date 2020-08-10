// express + session + passport によるメール+パスワード認証
const jwt = require('jsonwebtoken');
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { v4: uuidv4 } = require('uuid');

User_data = []

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};

var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Passportの初期化
app.use(passport.initialize());

//// セッションにユーザーIDを格納
//passport.serializeUser(function(user, done) {
//  done(null, user.id);
//});
//// 認証後セッションのユーザーIDからユーザー情報を取得する
//passport.deserializeUser(function(id, done) {
//  User.findById(id, function(err, user) {
//    done(err, user);
//  });
//});
//

// jwtを使用した認証ストラテジー
passport.use('jwt-oauth',new JwtStrategy(opts, function(jwt_payload, done) {

    //User.findOne({id: jwt_payload.sub}, function(err, user) {
    //    if (err) {
    //        return done(err, false);
    //    }
    //    if (user) {
    //        return done(null, user);
    //    } else {
    //        return done(null, false);
    //        // or you could create a new account
    //    }
    //});
}));

// passport-loginを使用したsignupストラテジー
// ログイン用のストラテジー
passport.use('local-login',new LocalStrategy(
  {
      usernameField: 'email',
      passwordField: 'password',
      session: false
  },
  (username, password, done) => {
    // usernameで検索

    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      // ユーザー登録なし
      if (!user) {
        return done(null, false, { message: 'usernameが登録されていません。' });
      }
      // パスワードを検証
      if (user.password !== password) {
        return done(null, false, { message: 'passwordが間違っています。' });
      }
      // 認証OKならユーザー情報を返す
      return done(null, user);
    });
  }
));


// サインアップ用のストラテジー
passport.use('local-signup', new LocalStrategy( { 
    usernameField: "email",
    passwordField: "password",
    session: false
    },
    function(username, password, done) {
      console.log("sign up!")
      for(let i =0; i < User_data.length; i++) {
        if(User_data[i].email == username){
            return done(null, false, { message: '既に登録されているemailです。' });
        }
      }
      //ユーザー登録
      let new_user = {
         email : username,
         password : password,
         id : uuidv4()
      }

      // JWT signするオプションを設定する
      let signopt = {
          //algorithm: 'RS256',
          expiresIn: '24h',
      };
      let payload = {
          email : new_user.email,
          user_id : new_user.id,
      }
      let privatekey = "hogehoge"
      User_data.push(new_user)
      new_user.token = jwt.sign(payload, privatekey, signopt)
      return done(null, new_user);
    })
);

// サインアップ処理
app.post('/signup',passport.authenticate('local-signup',{session: false}), (req, res, next) => {
        console.log("req user")
        console.log(req.user)
        console.log("user data list")
        console.log(User_data)
        res.cookie("jwt",req.user.token)
        res.send("ok") 
    }
);

// ログイン処理
app.post('/login', passport.authenticate('local-login',
  {
    //successRedirect: '/users',
    //failureRedirect: '/login',
    session: false
  }
));


//ログアウト
app.post('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.listen(8081, () => console.log('Example app listening on port 8081!'))