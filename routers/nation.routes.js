import { Router } from "express"
import {getAllNations, getNationById} from '../controllers/nation.controller.js'

export const route = Router()

route.get('/',getAllNations)
route.get('/:id',getNationById)