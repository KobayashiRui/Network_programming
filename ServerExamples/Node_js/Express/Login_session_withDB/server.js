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

// セッションにユーザーデータを格納
passport.serializeUser(function(user, done) {
  done(null, user);
});
// 認証後セッションのユーザーIDからユーザー情報を取得する
passport.deserializeUser(async function(user, done) {
  //let user = await User.query().findById(id) //objecitonのクエリ
  console.log("this is session")
  console.log(user)
  done(null, user)
  //User.findById(id, function(err, user) {
  //  done(err, user);
  //});
});


// ログイン用のストラテジー
// 新しいfield作れるの？？
passport.use('local-login',new LocalStrategy(
  { // fieldとの対応
    usernameField:"username",
    passwordField:"password"
  },
  async function(username, password, done) {
    // usernameで検索
    const _query_result = await User.query().where("name",username)//.where("password",password)
    const query_result = _query_result[0]

    //ユーザー登録していない
    if(!query_result){
      return done(null, false,{message:"ユーザー未登録"})
    }
    else if(query_result.password != password){
      return done(null, false,{message:"パスワードが違います"})
    }

    return done(null, query_result)

  }
));

// サインアップ用のストラテジー
passport.use('local-signup', new LocalStrategy( { 
    usernameField: "username",
    passwordField: "password"
    },
    async function(username, password, done) {
      console.log("sign up!")
      const _query_result = await User.query().where("name",username)//.where("password",password)  
      const query_result = _query_result[0]
      //ユーザー登録済み
      if(!!query_result){
        return done(null, false, {message:'すでに登録されています'})
      }
      //ユーザー登録
      const _create_user_result = await User.query().insert({
        name:username,
        password:password
      })

      return done(null, _create_user_result)
  }
));

// サインアップ処理
app.post('/signup',passport.authenticate('local-signup'), (req, res, next) => {
        res.send("ok") 
    }
);

// ログイン処理
app.post('/login', passport.authenticate('local-login'), (req,res, next)=> {
  console.log("login user")
  console.log(req.user)
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
  console.log(req.user)
  if(req.user.level != 0){
    req.logout()
    res.redirect("/")
  }
  res.send(req.user)
})


app.listen(8081, () => console.log('Example app listening on port 8081!'))