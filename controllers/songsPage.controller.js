import Genres from "../models/genres.model.js"
import Song from "../models/song.model.js"

const formatData = {
    genre: [],
    songsList: []
}

const genre = async(id) => {
    return await Genres.findById(id)
            .select('img name _id id')
}

const songs = async(id) => {
    return await Song.find({genre: id})
            .select('_id img name singerName duration')
}

export const songsPage = async(req, res) => {
    try {
        const id = req.params.id
        const promises = [
            genre(id),
            songs(id)
        ]

        const data = await Promise.all(promises)

        formatData.genre = data[0]
        formatData.songsList = data[1]

        return res.json(formatData)
        
    } catch (err) {
        console.error('Error:',err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}