import {connection} from "./queue.js";

import {Worker} from "bullmq";

const emailWorker = new Worker(
    // fisrt argument is the name of the queue on which the worker will listen for jobs
    "email-queue" , 

    // secnd argument is the function which will be executed when a job is added to the queue
    // it is bussiness logic of the worker
    async(job) => {
        console.log("Processing email job : " , job.id , job.name , job.data);
        await new Promise((resolve) => setTimeout(resolve , 5000));
        console.log("Email job completed : " , job.id);
    }

    // now we will pass the connection object to the worker so that it can connect to the redis server
    , {connection}
);

// now we will make the worker listen for events like completed , failed , etc

emailWorker.on("active", (job) => {
    console.log("Job started:", job.id);
});

emailWorker.on("completed" , (job) => {
    console.log("Email job completed : " , job.id);
});

emailWorker.on("failed" , (job , err) => {
    console.log("Email job failed : " , job.id , err);
});