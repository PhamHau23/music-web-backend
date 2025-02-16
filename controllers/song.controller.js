import Genres from "../models/genres.model.js";
import Singer from "../models/singer.model.js";
import Song from "../models/song.model.js";
import moment from "moment-timezone";

export const getAllSong = async(req, res) => {
    try{
        const songs = await Song.find()
            .populate([
                {path: 'nation', select: 'name -_id'},
                {path: 'genre', select: 'name -_id'},
                {path: 'singerId', select: 'slug _id'},
                {path: 'singerName', select: 'name -_id'}
            ])
        const formatData = songs.map(song => {
            return {
                ...song.toObject(),
                releaseDate: moment(song.releaseDate).format('DD-MM-YYYY'),
                createdAt: moment(song.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY HH:mm:ss'),
                updatedAt: moment(song.updatedAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY HH:mm:ss')
            }
        })
        return res.json(formatData)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getSongById = async(req, res) => {
    try{
        const id = req.params.id
        const songs = await Song.findById(id)
        await Song.findByIdAndUpdate(
            id,
            {$inc: {view: 1}}    
        )
        const formatData = {
            _id: songs.id,
            name: songs.name,
            singerName: songs.singerName,
            img: songs.img,
            url: songs.url,
            duration: songs.duration
        }
        return res.json(formatData)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getSongBySingerId = async(req, res) => {
    try{
        const singerId = req.params.id
        const songs = await Song.find({singerId: {$in: singerId}})
            .select('-url -singer -singerName')
            .populate([
                {path: 'nation', select: 'id name -_id'},
                {path: 'genre', select: 'id name -_id'}
            ])
        const singer = await Singer.findById(singerId)
        
        const newData = [
            {
                singerName: singer.name,
                songs
            }
        ]

        return res.json(newData)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getAllSongByGenreId = async(req, res) => {
    try{
        const genreId = req.params.id
        const genre = await Genres.findOne({id: genreId})
        const songs = await Song.find({genre: genre._id})
            .select('-nation -genre -url -singerId')
        const newData = [
            {
                genre: genre.name,
                songs
            }
        ]
        return res.json(newData)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getSongSearch = async(req, res) => {
    try{
        const {query} = req.query
        if(!query) return res.jon([])

        const songs = await Song.find({$or: [
            {name: new RegExp(query, "i")},
            {singerName: new RegExp(query, "i")}
        ]}).limit(5)
        return res.json(songs)
    }catch(err) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}