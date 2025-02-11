import Genres from '../models/genres.model.js'
import Nation from '../models/nation.model.js'

const data = [
    { id: 'krpop', name: 'k pop', img: 'https://res.cloudinary.com/dtzqisgc8/image/upload/v1734332671/webMusic/theloai/kpop_a6i3xj.jpg', nation: 'hàn quốc', numVisited: 0},
]

const addData = async () => {
    for(const item of data){
        const nation = await Nation.findOne({name: item.nation})
        
        if(nation){
            await Genres.create({
                id: item.id,
                nationId: nation._id,
                nation: nation.id,
                name: item.name,
                img: item.img,
                numVisited: item.numVisited
            })
        }else{
            console.log(`Quốc gia "${item.nation}" không tồn tại!`);
        }
    }

    console.log('genres added')
}

export default addData