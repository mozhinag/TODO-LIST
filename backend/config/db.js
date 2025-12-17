import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected:${conn.connection.host}`.bgCyan.bold.black)
    } catch (error) {
        console.log(error);
           if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    }
}
