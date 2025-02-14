import { Router } from "express";
import { deleteGenre, deleteSinger, deleteSong, getAdminGenres, getAdminSongs, getAdminUploadSongPage, postGenre, postSinger, postSong, putRole } from "../controllers/admin.controller.js";
import { upload, uploadImg } from "../middleware/uploadImg.js";
import { uploadFields, uploadSong } from "../middleware/uploadSong.js";

export const route = Router()

route.get('/genres', getAdminGenres)
route.get('/song', getAdminSongs)
route.get('/uploadsongpage', getAdminUploadSongPage)
route.delete('/deletesong/:id', deleteSong)
route.delete('/deletegenre/:id', deleteGenre)
route.delete('/deletesinger/:id', deleteSinger)
route.post('/post/singer', upload.single('img'), uploadImg('casi'), postSinger)
route.post('/post/genre', upload.single('img'), uploadImg('theloai'), postGenre)
route.post('/post/song', uploadFields, uploadSong, postSong)
route.put('/put/role/:id', putRole)