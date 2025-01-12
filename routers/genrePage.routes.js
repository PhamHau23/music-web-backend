import { Router } from "express";
import { genrePage } from "../controllers/genrePage.controller.js";

export const route = Router()

route.get('/:id', genrePage)