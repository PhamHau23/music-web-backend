import express from 'express';
import router from './routers/index.js'
import { connectDB } from './configs/mongoDb.js';
import cors from 'cors'
const app = express()

connectDB()

app.use(express.json())
app.use(cors())
app.use('/api', router)


app.listen(3000, () => {
  console.log("Server is running");
});