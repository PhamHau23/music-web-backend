import Genres from "../models/genres.model.js";


export const getAllGenres = async(req, res) => {
    try{
        const genres = await Genres.find().select('name img nation numbVisited id')
        return res.json(genres)
    }catch(error){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getAllIdGenres = async(req, res) => {
    try {
        const nationId = req.query.id
        const genres =  await Genres.find({nation: nationId}).select('id _id')
        return res.json(genres)   
    }catch(error){
        console.log('Error:', error)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getGenreById = async(req, res) => {
    try{
        const genreId = req.params.id
        const genre = await Genres.find({id: genreId})
        await Genres.updateOne(
            {id: genreId},
            {$inc: {numbVisited: 1}}
        )
        return res.json(genre)
    }catch(error){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
} 