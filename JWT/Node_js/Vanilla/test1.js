const jwt = require('jsonwebtoken');

let jwtPayload = {
    email : "hoge@gmail.com",
    name : "hogehoge",
    jti:"hogehoge123"
}

const jwtSecret = 'secret_key_goes_here'

const jwtOptions = {
    algorithm: 'HS256',
}

let token = jwt.sign(jwtPayload, jwtSecret, jwtOptions);
console.log("Token: " + token);

jwt.verify(token, jwtSecret,{jwtid:"hogehoge123"}, (err, decoded) => {
    if(err){ 
        console.log("Error")
    }else{
        console.log("OK: decoded email: " + decoded.email + ", decoded name: " + decoded.name)
        console.log(decoded)
    }
})