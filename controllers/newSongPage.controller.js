import Song from "../models/song.model.js"

export const newSongPage = async (req, res) => {
    try{
        const time = new Date()
        time.setMonth(time.getMonth() - 1)

        const song = await Song.find({updatedAt: { $gte: time }})
                    .sort({view: -1})
                    .limit(100)
                    .select('_id name singerName img duration genre singerId')
                    .populate([
                        {path: 'genre', select: '__id name id'},
                        {path: 'singerId', select: 'slug name -_id'}
                    ])

        return res.json(song)
    }catch(err){
        console.error('Error: ',err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}