import { Router } from "express"
import {getAllNations, getNationById, deleteNationById, putNationById, postNation} from '../controllers/nation.controller.js'

export const route = Router()

route.get('/',getAllNations)
route.get('/:id',getNationById)
route.delete('/:id',deleteNationById)
route.put('/:id',putNationById)
route.post('/',postNation)