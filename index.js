import express, { query, response } from 'express';
import mssql from 'mssql';
import cors from 'cors';
import multer from 'multer';
import cloudinary from './configs/cloudinaryConfig.js'
import { dbConfig } from './configs/database.js';
import { getTheLoai } from './theLoai/theLoai.js';

const app = express()
const router = express.Router()
app.use(cors())
app.use(express.json())
const port = 3000
app.use(router)


//config multer

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'bh-image') {
      cb(null, './uploads/image/');
    } else if (file.fieldname === 'mp3') {
      cb(null, './uploads/nhac/');
    };
  }
});

const upload = multer({storage: storage}).fields([
  { name: 'bh-image', maxCount: 1 },
  { name: 'mp3', maxCount: 1 }
]);


//sql connect
mssql.connect(dbConfig, (err) => {
  if (err) {
    console.log('err:', err);
  } else {
    console.log('Kết nối thành công');
  }
});

//api bai hat
router.get('/quoc-gia', async (req, res) => {
  try{
    const query = 'select * from QuocGia'
    const data = await new mssql.Request().query(query)
    res.send(data.recordset)
  }catch(err){
    res.send(err)
    console.log(err)
  }
})

router.get('/the-loai', async (req, res) => {
  try{
    const query = 'select * from TheLoai'
    const data = await new mssql.Request().query(query)
    res.send(data.recordset)
  }catch(err){
    res.send(err)
    console.log(err)
  }
})

router.get('/the-loai/:id', async (req, res) => {
  const id = req.params.id
  const query = `select * from theloai where idQuocGia = '${id}'`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

router.post('/upload/quocgia', async(req, res) => {
  try{
    
  }catch(err){
    res.send('error',err)
    console.log(err)
  }
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});