import Genres from "../models/genres.model.js"
import Nation from "../models/nation.model.js"
import Song from "../models/song.model.js"
import Singer from "../models/singer.model.js"

const formatData = {
    nation: [],
    data: {
        prominentGenre: [],
        hotSongs: [],
        singer: []
    }
}

const nation = async (id) => {
    return await Nation.findOne({id: id})
            .select('name img')
}

const prominentGenre = async (id) => {
    return await Genres.find({nation: id})
            .sort({numbVisited: -1})
            .limit(5)
            .select('-__v -nation -createdAt -updatedAt')
}

const hotSongs = async (id) => {
    const nation = await Nation.findOne({id: id})
    return await Song.find({nation: nation._id})
            .sort({view: -1})
            .limit(12)
            .populate([
                {path: 'singerId', select: 'slug name -_id'}
            ])
            .select('-nation -url -genre -updatedAt -__v')
}

const singers = async (id) => {
    const nation = await Nation.findOne({id: id})
    return await Singer.find({nation: nation.name})
            .sort({view: -1})
            .limit(6)
            .select('name img')
}

export const genrePage = async (req, res) => {
    try{
        const id = req.params.id
        const promises = [
            nation(id),
            prominentGenre(id),
            hotSongs(id),
            singers(id)
        ]

        const data = await Promise.all(promises)

        formatData.nation = data[0]
        formatData.data.prominentGenre = data[1]
        formatData.data.hotSongs = data[2]
        formatData.data.singer = data[3]

        return res.json(formatData)
    }catch(err){
        console.log('Error:', err);
        return res.status(500).json({ message: 'Không lấy được dữ liệu' });
    }
}