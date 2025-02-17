import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {

    title: {
      type: String,
      required: true,
    },    
    gigId: {
      type: String,
      required: true,
    }
   ,
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    deadline:{
      type:String,
      required:true  
    },
    isDelivered:{
      type:Boolean,

    },
    contractAddress:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);