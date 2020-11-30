// Redisのpulisher
const redis = require("redis");
const publisher = redis.createClient();

publisher.publish("notification", "{\"message\":\"Hello world from Asgardian!\"}", function(){
 process.exit(0);
});