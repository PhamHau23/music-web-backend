import { Router } from "express";
import { deleteUser, getProfile, getUser, login, putAvatar, register } from "../controllers/user.controller.js";
import { upload, uploadImg } from "../middleware/uploadImg.js";

export const route = Router()

route.post('/login', login)
route.post('/register', register)
route.get('/profile', getProfile)
route.get('/getUser', getUser)
route.delete('/deleteUser/:id', deleteUser)
route.put('/put/avatar/:id', upload.single('img'), uploadImg('user'), putAvatar)