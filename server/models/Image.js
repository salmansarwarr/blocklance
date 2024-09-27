
import mongoose from "mongoose";
const { Schema } = mongoose;

const imageSchema = new mongoose.Schema({
    filename: String,
    path: String,
    createdAt: { type: Date, default: Date.now }
  });
  
 export const Image = mongoose.model('Image', imageSchema);
 