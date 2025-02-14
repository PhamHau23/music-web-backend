import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import User from "../models/user.model.js"
import {v2 as cloudinary} from "cloudinary"
export const register = async(req, res) => {
    try{
        const {username, password} = req.body

        const user = await User.findOne({username})
        if (user) return res.status(404).json({ error: "Username đã tồn tại" })

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({username, password: hashedPassword})
        await newUser.save()
        return res.status(201).json({ message: "Đăng ký thành công!" })
    }catch(error){
        return res.status(500).json({ error: `${error.message}` })
    }
}

export const login = async(req, res) => {
    try{
        const {username, password} = req.body
        
        const user = await User.findOne({username})
        if(!user) return res.status(404).json({ message: "Tài khoản không chính xác" })
            
            
        const _password = await bcrypt.compare(password, user.password)
        if (!_password) return res.status(404).json({ message: "Mật khấu không chính xác" })


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token })
    }catch(error){
        return res.status(500).json({ message: `${error.message}` })
    }
}

export const getProfile = async(req, res) => {
    const authToken = req.headers.authorization

    if (!authToken || !authToken.startsWith("Bearer ")){
        return res.status(401).json({ message: `${authToken} không hợp lệ`});
    }
    const token = authToken.split(" ")[1];

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Trả về thông tin user
    res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
    }
} 

export const getUser = async(req, res) => {
    try {
        const user = await User.find().select('username role img')
        return res.json(user)
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "lỗi api" });
    }
}

export const deleteUser = async(req, res) => {
    try {
        const id = req.params.id
        await User.deleteOne({_id: id})
        return res.status(200).json({message: `đã xóa thành công user`})
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "lỗi api" });
    }
}

export const putAvatar = async(req, res) => {
    try {
        const id = req.params.id
        const img = await req.file
        const user = await User.findById(id)

        if(user.imgPublicId){
            await cloudinary.uploader.destroy(user.imgPublicId)
        }

        const updateAvatar = await User.findByIdAndUpdate(
            id,
            {$set: {
                img: img.cloudinaryUrl,
                imgPublicId: img.publicId
            }},
            { new: true, runValidators: true }
        )

        if(!updateAvatar){
            return res.status(404).json({message: 'không tìm thấy user'})
        }

        return res.status(200).json({message: 'thay đổi avatar thành công'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' })
    }
}