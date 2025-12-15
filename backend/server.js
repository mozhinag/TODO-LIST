import express, { urlencoded } from 'express';
import colors from 'colors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes.js'
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded())

app.use('/api/todos', todoRoutes);


const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`.bgBlue.bold.white)
})
