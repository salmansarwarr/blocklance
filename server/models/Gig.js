import mongoose from "mongoose";
const { Schema } = mongoose;

const gigSchema = Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, default: 0 },
        tags: [String],
        createdDate: { type: Date, default: new Date().getDate() },
    },
    { timestamps: true }
);

export default mongoose.model("Gig", gigSchema);
