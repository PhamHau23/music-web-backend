import { Router } from "express";
import { deleteUser, getProfile, getUser, login, register } from "../controllers/user.controller.js";

export const route = Router()

route.post('/login', login)
route.post('/register', register)
route.get('/profile', getProfile)
route.get('/getUser', getUser)
route.delete('/deleteUser/:id', deleteUser)