import Nation from '../models/nation.model.js'

export const getAllNations = async (req, res) => {
    try{
        const nations = await Nation.find()
        return res.json(nations)
    }catch (err) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

export const getNationById = async (req, res) => {
    try{
        const id = req.params.id
        const nation = await Nation.find({id: id})
        await Nation.updateOne(
            {id: id},
            {$inc: {numVisited: 1}}
        )
        return res.json(nation)
    }catch(err){
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}