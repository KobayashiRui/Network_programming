const redis = require("redis");
const subscriber = redis.createClient();
const client = redis.createClient();
const main = async () => {

    subscriber.on("message", function (channel, message) {
     console.log("Message: " + message + " on channel: " + channel + " is arrive!");
    });
    subscriber.subscribe("__keyevent@0__:expired");
    client.set("test", "hoge", 'EX', 5)
    //subscriberをsetなどに使用するとエラー
    //subscriberはsubscribeにのみ使用する
}
  
main();