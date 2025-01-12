import slugify from 'slugify'
import {connectDB} from '../configs/mongoDb.js'
import Nation from '../models/nation.model.js'
import Singer from '../models/singer.model.js'

const data = [

]

export const addSinger = async() => {
    await connectDB()
    for(const item of data){
        const nation = await Nation.findOne({id: item.nation})
        const slug = slugify(item.name, {lower: true})
        const dateOb = item.birthDate === '' ? '' : new Date(item.birthDate)

        console.log(slug)
        
        if(nation){
            await Singer.create({
                slug: slug,
                name: item.name,
                nation: nation.name,
                address: item.address,
                img: item.img,
                albums: item.albums,
                birthDate: dateOb
            })
        }else{
            console.log('lỗi')
        }
    }

    console.log('singer added')
}