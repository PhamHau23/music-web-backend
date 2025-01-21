import Singer from "../models/singer.model.js"
import Song from "../models/song.model.js"

//singer page

const singerPageFormatData = {
    singerInfo: [],
    newSong: [],
    hotSong: [],
    test: []
}

const getNewSong = (id) => {
    const song = Song.findOne({singerId: {$in: id}})
    .sort({createdAt: -1})
    .select('name singerName img duration view releaseDate')

    return song
}

const getHotSong = (id) => {
    const song = Song.find({singerId: {$in: id}})
    .limit(6)
    .sort({view: -1})
    .populate({path: 'singerId', select: 'name slug'})
    .select('name singerName singerId img')

    return song
}

const getData = (id) => {
    const song = Song.aggregate([
        {$group: {
            singerId: {$in: id},
            newSong: { $limit: 1, $sort: {createdAt: -1}},
            hotSong: { $limit: 6, $sort: {view: -1}}
        }}
    ])

    return song
}

const singerData = async (slug) => {
    const singer = await Singer.findOne({slug: slug}).select('name slug img')

    const promises = [
        getNewSong(singer._id),
        getHotSong(singer._id),
        //getData(singer._id)
    ]

    const data = await Promise.all(promises)
    
    await Promise.all([
        singerPageFormatData.singerInfo = singer,
        singerPageFormatData.newSong = data[0],
        singerPageFormatData.hotSong = data[1],
        //singerPageFormatData.test = data[2]
    ])

    return singerPageFormatData
}


export const getSingerPageData = async(req, res) => {
    try{
        const slug = req.params.slug
        await singerData(slug)
        return res.json(singerPageFormatData) 
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}