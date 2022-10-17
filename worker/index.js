const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: ()=>1000
})
console.log("connected to reddis host:" +keys.redisHost+" port:"+keys.redisPort)
const sub = redisClient.duplicate();

function fib(index){
    if(index<2) return 1;
    return (fib(index-1)+fib(index-2))
}


sub.on('message',(channel,message)=>{
    console.log('calculating fib for '+message)
    redisClient.hset('values',message,fib(parseInt(message)))
});
sub.subscribe('insert');


console.log("Worker ready")