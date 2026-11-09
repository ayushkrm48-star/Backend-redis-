import express from "express"

import Redis from "ioredis"

const app = express();

app.use(express.json());

const redis = new Redis("redis://localhost:6379");

// first we will store the user profile in json

app.post("/user/:id/json" , async(req , res) => {
    const {id} = req.params;
    const userProfile = req.body;

    await redis.set(`user:${id}:json` , JSON.stringify(userProfile));

    res.json({
        message : "User profile stored successfully",
        savedAs : "json"
    });
});


app.get("/user/:id/json" , async(req , res) => {
    const {id} = req.params;

    const userProfile = await redis.get(`user:${id}:json`);

    if(!userProfile){
        return res.status(404).json({
            message : "User profile not found"
        });
    }

    res.json({
        message : "User profile retrieved successfully",
        userProfile : JSON.parse(userProfile)
    });
});

// now we will store the user profile in hash

app.post("/user/:id/hash" , async(req , res) => {
    const {id} = req.params;
    const userProfile = req.body;

    await redis.hset(`user:${id}:hash` , userProfile);
    // through this method we can store  the user profile as a whole object as it is in hash format
    // and later we can access the individual fields of the user profile using hgetall or hget method

    res.json({
        message : "User profile stored successfully",
        savedAs : "hash"
    });
});

app.get("/user/:id/hash" , async(req , res) => {
    const {id} = req.params;

    const userProfile = await redis.hgetall(`user:${id}:hash`);

    res.json({
        message : "User profile retrieved successfully",
        userProfile : userProfile
    });
});


// now when user wants to update any field then we can update the individual field of the user profile using hset method

app.patch("/user/:id/hash" , async(req , res) => {
    const{id} = req.params;
    const updates = req.body;

    console.log(updates);

    await redis.hset(`user:${id}:hash` , updates);

    res.json({
        message: "User profile updated successfully",
        updates: updates
    });
});


// delete an indivisual field

app.delete("/user/:id/hash/:field" , async(req , res) => {
    const {id , field} = req.params;
    await redis.hdel(`user:${id}:hash` , field);
    
    res.json({
        message : `Field ${field} deleted successfully from user profile`
    });
});

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
});