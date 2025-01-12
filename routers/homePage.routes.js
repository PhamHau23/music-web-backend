import { Router } from "express";
import { getDataHomePage } from "../controllers/homePage.controller.js";

export const route = Router()

route.get('/', getDataHomePage)