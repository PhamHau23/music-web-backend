import { Router } from "express";
import { songsPage } from "../controllers/songsPage.controller.js";

export const route = Router()

route.get('/:id', songsPage)