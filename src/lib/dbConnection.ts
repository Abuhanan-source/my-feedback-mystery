import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const Connection:ConnectionObject = {}

async function dbconnection(): Promise<void> {
    if (Connection.isConnected) {
        console.log("Database already connected");
        return
    }

    try {
       const db = await mongoose.connect(process.env.MONGO_URI || '' , {})

       Connection.isConnected = db.connections[0].readyState

       console.log("DB connected Successfully!");
       
    } catch (error) {
        console.log("Database connection failed!",error);
        
        process.exit(1)
    }
}

export default dbconnection;