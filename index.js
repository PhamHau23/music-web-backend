import express, { query, response } from 'express';
import mssql from 'mssql';
import cors from 'cors';
import multer from 'multer';
import redis from 'redis'
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

//api quoc gia
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

// api the loai
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

// api lay cac the loai theo quoc gia
router.get('/api/:idquocgia/the-loai', async (req, res) => {
  const id = req.params.idquocgia
  const query = `select * from theloai where idQuocGia = '${id}'`
  const query1 = `update QuocGia set luotTruyCap = luotTruyCap + 1 where id = '${id}'`
  await new mssql.Request().query(query1)
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

// api lay ra 1 the loai theo id
router.get('/api/the-loai/:idtheloai', async (req, res) => {
  const id = req.params.idtheloai
  const query = `select * from TheLoai where id = '${id}'`
  await new mssql.Request().query(`update TheLoai set luotTruyCap = luotTruyCap + 1 where id = '${id}'`)
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

// api lay ra danh sach bai hat theo tung the loai
router.get('/api/:idtheloai/songs', async (req, res) => {
  const idtheloai = req.params.idtheloai
  const query =  `select * from BaiHat where idTheLoai = '${idtheloai}'`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

// api lay ra file mp3 cua bai hat da chon
router.get('/api/song/:idsong', async (req, res) => {
  const idSong = req.params.idsong
  const query =  `select url from BaiHat where id = '${idSong}'`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

// api lay ra danh sach top100 theo tung khu vuc
router.get('/api/:idquocgia/top100', async (req, res) => {
  //
})

// api lay ra cac bai hat thuoc top100 cua the loai da chon
router.get('/api/:idtheloai/top100song', async (req, res) => {
  const idTheLoai = req.params.idtheloai
  const query = `select top(100) id,tenBaiHat,img,idCasi,idTheLoai from BaiHat where idTheLoai = '${idTheLoai}' order by soLuotNghe desc`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

// api lay ra bai hat moi
router.get('/api/songnewupdate', async (req, res) => {
  const query = `select top(9) id,tenBaiHat,img,idCasi,idTheLoai,ngayPhatHanh from BatHat order by ngayPhatHanh desc`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

// api top100 all song
router.get('/api/top100allsong', async (req, res) => {
  const query = `select top(100) id,tenBaiHat,img,idCasi,idTheLoai from BatHat order by soLuotNghe desc`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

// api trang chủ

const newData = {
  newSongsList: {
    title: 'Mới Phát Hành',
    songsList: [

    ]
  },

  rankNewSongsList: {
    title: 'Bảng Xếp Hạng Nhạc Mới',
    songsList: [
      
    ]
  }
}

router.get('/api/home', async (req, res) => {
  const query = `select top(4) img, tenTheLoai, id, luotTruyCap from TheLoai order by luotTruyCap desc`
  const data = await new mssql.Request().query(query)
  res.send(data.recordset)
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});