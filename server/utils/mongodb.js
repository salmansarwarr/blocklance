import mongoose from "mongoose"

const mongoURI = "mongodb+srv://ullah4406732:dxzbT3A101JOT4lY@cluster0.bvdg0yz.mongodb.net/"
// const connectToMongo = () => {
//     mongoose.connect(mongoURI, () => {
//         console.log("Connected to Mongo Successfully");
//     })
// }


 export  const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
       await mongoose.connect(mongoURI) 
        console.log('Mongo connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

