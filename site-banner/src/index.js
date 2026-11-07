import express from "express"
import connectDB from "./config/db.js"
import redis from "./config/redis.js"
import bannerRoutes from "./routes/banner.route.js"


const app = express();

app.use(express.json());

// Banner routes
app.use("/banners", bannerRoutes);
const startServer = async() => {
    try{
        await connectDB();
        await redis.ping();
        console.log("redis connected successfully!");

        app.listen(3000 , () => {
            console.log(`server started at port : 3000`);   
        });

    }
    catch(error){
        console.error("Application startup failed:", error);
        process.exit(1);
    }
}

startServer();






