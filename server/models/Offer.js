import mongoose from "mongoose";
const { Schema } = mongoose;

const offerSchema = Schema(
    {
        buyerId: {
            type: String,
            required: true,
        },
        sellerId: {
            type: String,
            required: true,
        },
        description: { type: String, required: true },
        price: { type: Number, default: 0 },
        deliveryDate: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);