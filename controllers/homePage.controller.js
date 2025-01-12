import Genres from "../models/genres.model.js"
import Nation from "../models/nation.model.js"
import Song from "../models/song.model.js"

const fomatData = {
    allNewSongs: [],
    vnNewSongs: [],
    notVnNewSongs: [],
    rankAllSong: [],
    featuredGenre: []
}

const vnNewSongs = async () => {
    const nation = await Nation.findOne({ id: 'vn' });
    return await Song.find({ nation: nation._id })
        .sort({ createdAt: -1 })
        .limit(9)
        .select('-url -view -__v -updatedAt')
        .populate([
            { path: 'nation', select: 'id -_id' },
            { path: 'genre', select: 'id -_id' }
        ]);
}

const allNewSongs = async () => {
    return await Song.find()
        .sort({ createdAt: -1 })
        .limit(9)
        .select('-url -view -__v -updatedAt')
        .populate([
            { path: 'nation', select: 'id -_id' },
            { path: 'genre', select: 'id -_id' }
        ]);
}

const qtNewSongs = async () => {
    const nation = await Nation.findOne({ id: 'vn'  });
    return await Song.find({ nation: {$ne: nation._id}})
        .sort({ createdAt: -1 })
        .limit(9)
        .select('-url -view -__v -updatedAt')
        .populate([
            { path: 'nation', select: 'id -_id' },
            { path: 'genre', select: 'id -_id' }
        ]);
}

const rankAllSong = async () => {
    const songs = await Song.find()
        .sort({ view: -1 })
        .limit(6)
        .select('-url -releaseDate -nation -genre -__v -createdAt')
    return songs
}

const featuredGenre = async () => {
    const genres = await Genres.find()
        .sort({ view: -1})
        .limit(5)
        .select('-nationId -createdAt -updatedAt')
    return genres
}

export const getDataHomePage = async (req, res) => {
    try {
        const promises = [
            allNewSongs(),
            vnNewSongs(),
            qtNewSongs(),
            rankAllSong(),
            featuredGenre()
        ];

        const results = await Promise.all(promises);

        fomatData.allNewSongs = results[0]
        fomatData.vnNewSongs = results[1]
        fomatData.notVnNewSongs = results[2]
        fomatData.rankAllSong = results[3]
        fomatData.featuredGenre = results[4]


        return res.json(fomatData);
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({ message: 'Không lấy được dữ liệu' });
    }
}