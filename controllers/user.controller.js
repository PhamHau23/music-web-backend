import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import User from "../models/user.model.js"

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
        let user, _password
        
        await Promise.all(
            [
                user = await User.findOne({username}),
                _password = await bcrypt.compare(password, user.password)
            ]
        )

        if (!user || !_password) return res.status(404).json({ error: "Tài khoản hoặc mật khấu không chính các" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    }catch(error){
        return res.status(500).json({ err: `${error.message}` })
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