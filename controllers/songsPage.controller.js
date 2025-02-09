import Genres from "../models/genres.model.js"
import Song from "../models/song.model.js"

const formatData = {
    genre: [],
    songsList: [],
    hotSingerName: []
}

const genre = async(id) => {
    return await Genres.findOne({id: id})
            .select('img name _id id')
}

const songs = async(id) => {
    return await Song.find({genre: id})
            .select('_id img name singerId singerName duration')
            .populate({path: 'singerId', select: 'slug name -_id'})
}

const hotSingerName = async(id) => {
    return await Song.find({genre: id})
            .limit(4)
            .select('singerId')
            .populate({path: 'singerId', select: 'slug name'})
}

export const songsPage = async(req, res) => {
    try {
        const id = req.params.id
        const genre1 = await Genres.findOne({id: id}).select('name img id')
        const promises = [
            genre(id),
            songs(genre1._id),
            hotSingerName(genre1._id)
        ]

        const data = await Promise.all(promises)

        await Promise.all([
            formatData.genre = data[0],
            formatData.songsList = data[1],
            formatData.hotSingerName = data[2]
        ])

        return res.json(formatData)
        
    } catch (err) {
        console.error('Error:',err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}