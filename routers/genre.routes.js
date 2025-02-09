import { Router } from "express";
import { getAllGenres, getAllIdGenres, getGenreById } from "../controllers/genre.controller.js";

export const route = Router()

//lay tat ca the loai
route.get('/',getAllGenres)
//lay the loai theo id
route.get('/:id', getGenreById)
//lay id the loai
route.get('/nation/id', getAllIdGenres)