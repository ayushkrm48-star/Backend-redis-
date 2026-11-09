import express from "express"
import Redis from "ioredis"

// creating a publisher
const publisher =  new Redis(process.env.REDIS_URL || "redis://localhost:6379");



const app = express();
app.use(express.json());


// endpoint on which we will recieve the data
app.post("/notifications" , (req , res) => {
    const payload = {
        title : req.body.title || "Default Title",
        createdAt : new Date().toISOString()
    }
    const receivers = publisher.publish("notifications" , JSON.stringify(payload));

    return res.json({
        message : "Message has been published"
    });
})
app.listen(3000 , () => {
    console.log(`App is listening on the sever : 3000`);
});
