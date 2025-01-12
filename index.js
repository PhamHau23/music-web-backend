import express from 'express';
import router from './routers/index.js'
import { connectDB } from './configs/mongoDb.js';
import cors from 'cors'
import addData from './theLoai/theLoai.js';
import { addSinger } from './theLoai/singer.js';
import addSong from './theLoai/song.js';
import updateSongDurations from './theLoai/song.js';
const app = express()

connectDB()

app.use(express.json())
app.use(cors())
app.use('/api', router)


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});