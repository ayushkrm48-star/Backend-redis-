import Redis from "ioredis"

// creating a subscriber
const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// now this subscriber must subscribe the channel on which the publisher will publish the message
subscriber.subscribe("notifications" , (error) => {
    console.log("Failed To Subscribe the channel ", error);
});

// now this subscriber will be listening on some events

subscriber.on("message" , (channel , message) => {
    console.log("Recieved on : " , channel , ":" , JSON.parse(message));
});

