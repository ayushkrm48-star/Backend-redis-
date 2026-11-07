import express from "express"
import Redis from "ioredis"
import crypto from "crypto";

const app = express();

app.use(express.json());

const redis = new Redis("redis://localhost:6379");

// first we will make a function to generate the optkey for any phone

function otpKey(phone){
    return `otp${phone}`;
}

// now user will give his phone number and we will generate the otp

app.post("/otp" , async(req , res) => {
    const{phone} = req.body;

    // now we will generate an otp and then we will cache this opt inside the redis for some duration
    const otp = crypto.randomInt(1000, 10000).toString();



    await redis.set(otpKey(phone) , otp , 'EX' , 3000000);
    // here otp is valid for 30 seconds
    res.json({
        message : "Otp Sent Successfully",
        otp : otp
    });
})


// now user will enter the otp and we have to verify the otp

app.post("/otp/verify" , async(req , res) => {
    const{phone , otp} = req.body;

    const cachedotp = await redis.get(otpKey(phone));
    if(!cachedotp){
        return res.status(200).json({
            message : "Otp has been expired , generate new otp"
        })
    }

    if(cachedotp !== otp){
        return res.status(400).json({
            message : "Invalid OTP"
        })
    }

    // now then we will authenticate the user from the database and then

    await redis.del(otpKey(phone));
    return res.json({message : "OTP verified successfully"});
})


// now we will make an endpoint to get the ttl of any phone number's otp

app.get("/otp/:phone", async(req , res) => {

    const ttl = await redis.ttl(otpKey(req.params.phone));
    
    return res.json({ttl});
});

// just dekhene ke liye redis ram mein values rakhta hain kya


app.listen(3000 , () => {
    console.log(`Server is running on Port : 3000`);
});