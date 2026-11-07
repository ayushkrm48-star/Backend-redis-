import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        redirectUrl: {
            type: String,
            required: true
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;