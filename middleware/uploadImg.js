import multer from "multer";
import { v2 as cloudinary } from "cloudinary"
import 'dotenv/config'


const storage = multer.memoryStorage()
const upload = multer({storage})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImg = (folder) => {
    return async(req, res, next) => {
        if (!req.file) {
            console.log('Không có file nào được upload.');
            return next(); 
        }
    
        try {
            const stream = cloudinary.uploader.upload_stream(
                { folder: `webMusic/${folder}` }, // Thư mục lưu ảnh trên Cloudinary
                (error, result) => {
                    if (error) {
                        console.error('Lỗi upload lên Cloudinary:', error);
                        return res.status(500).json({ message: 'Upload thất bại', error });
                    }
    
                    req.file.cloudinaryUrl = result.secure_url; // Gán URL cho req.file
                    next();
                }
            );
    
            stream.end(req.file.buffer); // Đọc buffer và upload
        } catch (error) {
            console.log('bat dau luu 3')     
            console.error('Lỗi xử lý file:', error);
            return res.status(500).json({ message: 'Lỗi xử lý file', error });
        }
    }
}
  
export {upload, uploadImg}