import { Router } from "express"
import { getAllSingers, getSingerById, getSingersByNation } from "../controllers/singer.controller.js"

export const route = Router()

route.get('/', getAllSingers)
route.get('/:slug', getSingerById)
route.get('/nation/:id', getSingersByNation)