const router = require("express").Router();
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  console.log('Serialize ...');
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserialize ...');
  done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());
//ログインミドルウェアの定義
passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
  
      (username, password, done) => {
        let user = users.find((user) => {
          return user.email === username && user.password === password
        })
  
        if (user) {
          done(null, user)
        } else {
          done(null, false, { message: 'Incorrect username or password'})
        }
      }
    )
  )

//ログイン処理をミドルウェアとしてrouterが使用するように設定


//router.post("/api/login",  passport.authenticate('local'),
//                        function(req, res){
//                            console.log("login request")
//                        console.log(req)
//                        console.log(req.user)
//                        res.send("Login OK")
//                    });

router.post("/api/login", (req, res, next) => {
    passport.authenticate("local",(err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.status(400).send([user, "Cannot log in", info]);
      }
  
      req.login(user, err => {
        res.send("Logged in");
      });
    })(req, res, next);
  });
//router.post("/api/login",(req,res)=>{
//    console.log("request")
//    res.send("aaaa")
//})

router.get("/api/ok",(req,res) => {
  console.log("user")
  console.log(req.user)
  res.send("ok")
});

router.post("/api/logout", (req,res) => {
  console.log("logout")
  req.logout()
  res.send("logout")
})

module.exports = router;