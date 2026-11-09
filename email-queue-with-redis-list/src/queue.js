// how to start the connection with bullmq

import {Queue} from "bullmq";



const connection  = {
    host : "localhost",
    port : 6379
}

const emailQueue = new Queue("email-queue" , {connection});

export { emailQueue , connection};
