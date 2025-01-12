import { Router } from "express";
import { getAllSong, getAllSongByGenreId, getSongById, getSongBySingerId, getSongSearch } from "../controllers/song.controller.js";


export const route = Router()

route.get('/',getAllSong)
route.get('/:id',getSongById)
route.get('/singerId/:id', getSongBySingerId)
route.get('/genreId/:id', getAllSongByGenreId)
route.get('/search/searchvalue', getSongSearch)