import Nation from "../models/nation.model.js"
import Singer from "../models/singer.model.js"

export const getAllSingers = async(req, res) => {
    try{
        const singer = await Singer.find()
                    .select('img name view nation')
                    .populate([{path: 'nation', select: 'id'}])
        return res.json(singer)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getSingerById = async(req, res) => {
    try{
        const slug = req.params.slug
        const singer = await Singer.findOne({slug})
        await Singer.findOneAndUpdate(
            {slug},
            {$inc: {view: 1}}
        )
        return res.json(singer)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getSingersByNation = async(req, res) => {
    try{
        const nationId = req.params.id
        const nation = await Nation.findOne({id: nationId})
        const singers = await Singer.find({nation: nation.name})
        const newData = [
            {
                nation: nation.name,
                singers
            }
        ]
        return res.json(newData)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}