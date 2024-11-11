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
router.get('/api/quoc-gia', async (req, res) => {
  try{
    const query = 'select * from QuocGia'
    const data = await new mssql.Request().query(query)
    res.send(data.recordset)
  }catch(err){
    res.send(err)
    console.log(err)
  }
})

router.get('/api/the-loai', async (req, res) => {
  try{
    const query = 'select * from TheLoai'
    const data = await new mssql.Request().query(query)
    res.send(data.recordset)
  }catch(err){
    res.send(err)
    console.log(err)
  }
})

router.get('/api/:idquocgia/the-loai', async (req, res) => {
  const id = req.params.idquocgia
  const query = `select * from theloai where idQuocGia = '${id}'`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

router.get('/api/:idtheloai', async (req, res) => {
  const id = req.params.idtheloai
  const query = `select * from theloai where id = '${id}'`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

router.get('/api/:idtheloai/songs', async(req, res) => {
  const idtheloai = req.params.idtheloai
  const query =  `select * from BaiHat where idTheLoai = '${idtheloai}'`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

router.get('/api/:idsong', async(req, res) => {
  const idSong = req.params.idsong
  const query =  `select url from BaiHat where id = '${idSong}'`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});