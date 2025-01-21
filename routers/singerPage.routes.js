import { Router } from "express"
import { getSingerPageData } from "../controllers/singerPage.controller.js"

export const route = Router()

route.get('/:slug',getSingerPageData)