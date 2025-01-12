import { Router } from "express";
import { getAllGenres, getGenreById, getGenresByNationId } from "../controllers/genre.controller.js";

export const route = Router()

//lay tat ca the loai
route.get('/',getAllGenres)
//lay the loai theo quoc gia
route.get('/nationid=:id', getGenresByNationId)
//lay the loai theo id
route.get('/:id', getGenreById)