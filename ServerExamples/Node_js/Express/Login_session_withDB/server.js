// express + session + passport によるメール+パスワード認証
const express = require("express");
const {Model} = require("objection")
const Knex = require("knex")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const redis = require("redis")
const session = require("express-session");
const RedisStore = require('connect-redis')(session);

const knex = Knex({
  client: 'pg',
  version: '12.1',
  connection:{
    host : '127.0.0.1',
    user : 'postgres',
    password: 'mysecretpassword',
    database : 'test0'
  }
})

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,

})

Model.knex(knex)

class User extends Model {
  static get tableName(){
    return 'user'
  }
}

const app = express();

let Users = [
  {
    id:1,
    name:'hoge',
    password:'test123'
  },
  {
    id:2,
    name:'hogeho',
    password:'test456'
  }
]

//json形式に対応する
app.use(express.json())
//urlデータに対応
app.use(express.urlencoded({ extended: true }));

// ここから追加
// セッションの設定
app.use(session({
  secret: 'secret word',
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: redisClient}),
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
passport.deserializeUser(async function(id, done) {
  let user = await User.query().findById(id)
  console.log(user)
  done(null, user)
  //User.findById(id, function(err, user) {
  //  done(err, user);
  //});
});

// ログイン用のストラテジー
passport.use('local-login',new LocalStrategy(
  { // fieldとの対応
    usernameField:"username",
    passwordField:"password"
  },
  async function(username, password, done) {
    // usernameで検索
    console.log(username + "," + password)
    const query_result = await User.query().where("name",username).where("password",password)
    console.log(query_result[0])
    if(!query_result){
      return done(null, false)
    }
    return done(null, query_result[0])

    //User.findOne({ username: username }, function(err, user) {
    //  if (err) { return done(err); }
    //  // ユーザー登録なし
    //  if (!user) {
    //    return done(null, false, { message: 'usernameが登録されていません。' });
    //  }
    //  // パスワードを検証
    //  if (user.password !== password) {
    //    return done(null, false, { message: 'passwordが間違っています。' });
    //  }
    //  // 認証OKならユーザー情報を返す
    //  return done(null, user);
    //});
  }
));

// サインアップ用のストラテジー
passport.use('local-signup', new LocalStrategy( { 
    usernameField: "username",
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

app.post('/login', passport.authenticate('local-login'), (req,res, next)=> {
  res.send("login ok")
});

//ログアウト
app.post('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/check_login', (req, res) => {
  res.send(req.user)
})


app.listen(8081, () => console.log('Example app listening on port 8081!'))