import express, { urlencoded } from 'express';
import colors from 'colors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes.js'
import { connectDB } from './config/db.js';
 import path from 'path';
 import { fileURLToPath } from 'url';

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded())

app.use('/api/todos', todoRoutes);


const PORT = process.env.PORT || 6000

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get(/.*/, (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`.bgBlue.bold.white)
})




 // "scripts": {

  //   "build": "npm install --prefix frontend --include=dev && npm run build --prefix        frontend && npm install --prefix backend",
  //   "start": "node backend/server.js",
  //   "dev": "concurrently -n FRONTEND,BACKEND -c cyan,magenta \"npm run dev --prefix frontend\" \"npm run server --prefix backend\""
  // },
