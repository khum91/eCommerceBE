import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URL,
    {
        dbName: process.env.MONGODB_NAME,
        autoCreate: true,
        autoIndex: true
    }
).then(()=>{
    console.log('DB connected')
}).catch((e)=>{
    console.log(e)
console.log('Error in connection with DB');
process.exit(1);
})