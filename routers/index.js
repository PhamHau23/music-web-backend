import { Router } from "express";
import {route as nationRoute, route} from "./nation.routes.js"
import {route as genreRoute} from "./genre.routes.js"
import {route as singerRoute} from "./singer.routes.js"
import {route as songRoute} from "./song.routes.js"
import {route as homePageRoute} from "./homePage.routes.js"
import {route as genrePageRoute} from "./genrePage.routes.js"
import {route as songsPageRoute} from "./songsPage.routes.js"
import {route as newSongPageRoute} from "./newSongPage.routes.js"
const router = Router()

router.use('/nation',nationRoute)
router.use('/genre', genreRoute)
router.use('/singer', singerRoute)
router.use('/song',songRoute)
router.use('/homepage', homePageRoute)
router.use('/genrepage', genrePageRoute)
router.use('/songpage', songsPageRoute)
router.use('/newsongpage', newSongPageRoute)

export default router