import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) throw new Error("Missing MONGODB_URL env var");

let cached = (global as any).mongoose;

if (!cached) {
  cached =(global as any).mongoose = { conn: null }
}

async function DBconnect(){

  if (cached.conn) {
    return cached.conn;
  }

    try{

        cached.conn = await mongoose.connect(process.env.MONGODB_URL!);
        console.log("DB Connected");

    }catch(err){
        cached =(global as any).mongoose = { conn: null };
        console.log("Error in connecting DB")
        throw err;
    }

    return cached.conn;

}

export default DBconnect;


