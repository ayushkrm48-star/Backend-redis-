import express from "express";
import {emailQueue} from "./queue.js";

const app = express();
app.use(express.json());


// now we will create a route to send the email and we will push the email data into the message queue by using the bullmq library
app.post("/send-email" , async(req , res) => {

    const {to , subject , body , priority , name} = req.body;

    // now we will add the email data into the queue
    const job = await emailQueue.add(
        // first argument is the name of the job
        name ,
        // second argument is the data which we want to pass to the worker
        {to , subject , body} ,

        // third argument is the options for the job
        {
            attempts : 3 , //number of attempts to process the job in case of failure
            backoff :{
                type : "exponential" , //type of backoff strategy
                delay : 5000 //delay in milliseconds before retrying the job
            },
            priority : priority , //priority of the job
        }
    );

    res.json({
        message : "Email job added to the queue" ,
        jobId : job.id
    });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});