import { Router } from "express";
import { newSongPage } from "../controllers/newSongPage.controller.js";

export const route = Router()

route.get('/',newSongPage)