import Router from "express"
import Banner from "../models/banner.model.js"
import redis from "../config/redis.js"

const router = Router();


const BANNER_KEY = "app:banner";

// posting the banner into the database

router.post("/" , async(req , res) => {
    try {
        const { title, imageUrl, redirectUrl } = req.body;

        if (!title || !imageUrl || !redirectUrl) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create banner in MongoDB
        const banner = await Banner.create({
            title,
            imageUrl,
            redirectUrl
        });

        // Invalidate old Redis cache
        await redis.del(BANNER_KEY);

        return res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// now fetching the banner

router.get("/" , async(req , res) => {
    try{
        // first we will check the redis
        const cachedBanner = await redis.get(BANNER_KEY);

        if(cachedBanner){
            return res.status(200).json({
                success: true,
                source: "Redis",
                data: JSON.parse(cachedBanner)
            });
        }

        // then we will be facing the cache miss 

        const banners = await Banner.find({
            active : true
        }).lean();
        // here i have used lean so that mongoose returns the whole document in the json format not the default mongoose.document format

        // now before returning the data we will first store in inside the redis

        await redis.set(BANNER_KEY , JSON.stringify(banners));

        return res.status(200).json({
            success: true,
            source: "MongoDB",
            data: banners
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/exists" , async(req , res) => {
    const exists = await redis.exists(BANNER_KEY);
    console.log(exists);
    res.status(200).json({exists : Boolean(exists)});
})

export default router;


