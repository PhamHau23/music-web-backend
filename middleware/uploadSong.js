import multer from "multer"
import streamifier from 'streamifier';
import { v2 as cloudinary } from "cloudinary"
import 'dotenv/config'


const storage = multer.memoryStorage()
const upload = multer({storage})

const uploadFields = upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'mp3', maxCount: 1 }
])

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadSong = async (req, res, next) => {
    // Nếu không có file nào được upload
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("Không có file nào được upload.");
      return next();
    }
  
    try {
      const uploadPromises = [];
  
      // Xử lý file ảnh (từ trường 'img')
      if (req.files.img) {
        req.files.img.forEach((file) => {
          const promise = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'webMusic/baihat',  // Folder chứa ảnh trên Cloudinary
                resource_type: 'image'
              },
              (error, result) => {
                if (error) return reject(error);
                // Gán URL nhận được từ Cloudinary vào đối tượng file
                file.cloudinaryUrl = result.secure_url
                file.publicId = result.public_id
                resolve(result);
              }
            )
            streamifier.createReadStream(file.buffer).pipe(stream);
          })
          uploadPromises.push(promise);
        })
      }
  
      // Xử lý file mp3 (từ trường 'mp3')
      if (req.files.mp3) {
        req.files.mp3.forEach((file) => {
          const promise = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'webMusic/mp3',     // Folder chứa file mp3
                resource_type: 'video'        
              },
              (error, result) => {
                if (error) return reject(error);
                file.cloudinaryUrl = result.secure_url
                file.publicId = result.public_id
                resolve(result);
              }
            )
            streamifier.createReadStream(file.buffer).pipe(stream)
          })
          uploadPromises.push(promise)
        })
      }
  
      await Promise.all(uploadPromises)
  
      next()
    } catch (error) {
      console.error("Lỗi khi upload file lên Cloudinary:", error)
      return res.status(500).json({ message: "Lỗi khi upload file", error })
    }
  };
  
export {upload, uploadSong, uploadFields}