// express + session + passport によるメール+パスワード認証
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");


const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// ここから追加
// セッションの設定
app.use(session({
  secret: 'secret word',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000
  }
}));
// Passportの初期化
app.use(passport.initialize());
// Passportとセッション管理を連携
app.use(passport.session());

// セッションにユーザーIDを格納
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// 認証後セッションのユーザーIDからユーザー情報を取得する
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// ログイン用のストラテジー
passport.use('local-login',new LocalStrategy(
  function(username, password, done) {
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
    passwordField: "password"
    },
    function(username, password, done) {
      console.log("sign up!")
    //// usernameで検索
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      // ユーザー登録済み
      if (!!user) {
        return done(null, false, { message: '既に登録されているusernameです。' });
      }
      // ユーザー登録
      User.create({
        username,
        password
      })
      .then(function(user) {
        // 完了したらユーザー情報を返す
        return done(null, user);
      })
      .catch(function(err) {
        console.log(err);
        return done(null, false, { message: '登録エラー' });
      });
    });
  }
));

// サインアップ処理
app.post('/signup',passport.authenticate('local-signup'), (req, res, next) => {
        res.send("ok") 
    }
);

// ログイン処理

app.post('/login', passport.authenticate('local-login',
  {
    //successRedirect: '/users',
    //failureRedirect: '/login',
    session: true
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