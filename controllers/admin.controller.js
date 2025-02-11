import Genres from "../models/genres.model.js"
import Nation from "../models/nation.model.js"
import Song from "../models/song.model.js"
import Singer from "../models/singer.model.js"
import slugify from "slugify"

const nation = async() => {
    const nations = await Nation.find().select('name img id')
    return nations
}

const genres = async() => {
    const genres = await Genres.find()
                    .select('id name img nation')
                    .populate({path: 'nationId', select: 'name'})
    return genres
}

const song = async() => {
    const songs = await Song.find()
                    .select('name singerName view img')
                    .populate([
                        {path: 'nation', select: 'id'},
                        {path: 'genre', select: 'id'}
                    ])
    return songs
}

//api page quan ly the loai
export const getAdminGenres = async(req, res) => {
    try {
        const formatData = {
            nation: [],
            genres: []
        }

        const data = await Promise.all([
            nation(),
            genres()
        ])

        await Promise.all([
            formatData.nation = data[0],
            formatData.genres = data[1]
        ])
        
        return res.json(formatData)

    } catch (error) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

//api page quan ly bai hat
export const getAdminSongs = async(req, res) => {
    try {
        const formatData = {
            nation: [],
            song: [],
            genres: []
        }

        const data = await Promise.all([
            nation(),
            song(),
            genres()
        ])

        await Promise.all([
            formatData.nation = data[0],
            formatData.song = data[1],
            formatData.genres = data[2]
        ])
        
        return res.json(formatData)

    } catch (error) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

//api page upload
export const getAdminUploadSongPage = async(req, res) => {
    try {
        const nation = req.query.nation
        const formatData = {
            genres: [],
            nation: [],
            singer: []
        }
        
        const data = await Promise.all([
            Genres.find(nation && {nation: nation}).select('name id nation'),
            Nation.find().select('name id'),
            Singer.find().select('name')
        ])

        await Promise.all([
            formatData.genres = data[0],
            formatData.nation = data[1],
            formatData.singer = data[2]
        ])

        return res.json(formatData)

    } catch (error) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không lấy được dữ liệu' })
    }
}

// api delete bai hat
export const deleteSong = async(req, res) => {
    try {
        const id = await req.params.id
        await Song.deleteOne({_id: id})
        return res.status(200).json({message: `đã xóa thành công bài hát`})
    } catch (error) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không xóa được bài hát' })
    }
} 

//api delete the loai
export const deleteGenre = async(req, res) => {
    try {
        const id = await req.params.id
        await Genres.deleteOne({_id: id})
        return res.status(200).json({message: `đã xóa thành công thể loại`})
    } catch (error) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không xóa được thể loại' })
    }
}

//api delete singer
export const deleteSinger = async(req, res) => {
    try {
        const id = await req.params.id
        await Singer.deleteOne({_id: id})
        return res.status(200).json({message: `đã xóa thành công ca si`})
    } catch (error) {
        console.log('Error:', err)
        return res.status(500).json({ message: 'Không xóa được thể loại' })
    }
}


//api upload singer
export const postSinger = async(req, res) => {
    try {
        const {name, date, nation, address} = await req.body
        const img = await req.file
        const _nation = await Nation.findOne({id: nation})
        const slug = slugify(name, {lower: true}) 

        if (!img || !img.cloudinaryUrl) {
            return res.status(400).json({ message: 'Không có file được upload lên Cloudinary' });
        }

        const newSinger = new Singer({
            slug: slug,
            name: name,
            nation: _nation.name,
            address: address,
            img: img.cloudinaryUrl,
            birthDate: date
        })

        newSinger.save()
        return res.status(200).json({message: 'Upload thành công!'})
    } catch (error) {
        console.log('Error:', error)
        return res.status(500).json({ message: 'khong upload duoc' })
    }
}

//api upload genre
export const postGenre = async(req, res) => {
    try {
        const {name, nation, id} = await req.body
        const img = await req.file
        const nationId = await Nation.findOne({id: nation})
        if (!img || !img.cloudinaryUrl) {
            return res.status(400).json({ message: 'Không có file được upload lên Cloudinary' });
        }

        const newGenre = new Genres({
            id: id,
            name: name,
            nation: nation,
            nationId: nationId._id,
            img: img.cloudinaryUrl
        })

        newGenre.save()
        return res.status(200).json({message: 'Upload thành công!'})
    } catch (error) {
        console.log('Error:', error)
        return res.status(500).json({ message: 'khong upload duoc' })
    }
}

//upload bai hat

export const postSong = async(req, res) => {
    try {
        const {name, nation, genre, singer} = await req.body
        const img = await req.files.img[0]
        const mp3 = await req.files.mp3[0]
        const nationId = await Nation.findOne({id: nation})
        const genreId = await Genres.findOne({id: genre})
        const singerIdArr = []
        const singerNameArr = await JSON.parse(singer)
        
        for(const singerName of singerNameArr){
            const slug = slugify(singerName, {lower: true})
            const _singer = await Singer.findOne({slug: slug})
            if(_singer){
                singerIdArr.push(_singer._id)
            }else{
                break
            }
        }

        if (!img || !img.cloudinaryUrl) {
            return res.status(400).json({ message: 'Không có file được upload lên Cloudinary' });
        }

        if (!mp3 || !mp3.cloudinaryUrl) {
            return res.status(400).json({ message: 'Không có file được upload lên Cloudinary' });
        }


        const newSong = new Song({
            name: name,
            nation: nationId._id,
            genre: genreId._id,
            img: img.cloudinaryUrl,
            imgPublicId: img.publicId,
            url: mp3.cloudinaryUrl,
            mp3PublicId: mp3.publicId,
            singerName: singerNameArr,
            singerId: singerIdArr
        })

        newSong.save()
        return res.status(200).json({message: 'Upload thành công!'})
    } catch (error) {
        console.log('Error:', error)
        return res.status(500).json({ message: 'khong upload duoc' })
    }
}

//sửa song
export const patchSong =  async(req, res) => {
    try {
        const songId = await req.params.id
        const updateData = await req.body
        const img = await req.file
        const nationId = await Nation.findOne({id: updateData.nation})
        const genreId = await Genres.findOne({id: updateData.genres})
        const song = await Song.findOne({_id: songId})

        console.log(img.originalname !== song.img)

        await Promise.all([
            updateData.nation = nationId._id,
            updateData.genres = genreId._id
        ])
    
        const updatedSong = await Song.findByIdAndUpdate(
          songId,
          {$set: {
            updateData,
            img: img.cloudinaryUrl
          }},
          { new: true, runValidators: true }
        )
    
        if (!updatedSong) {
          return res.status(404).json({ error: 'Không tìm thấy bài hát.' })
        }
    
        return res.status(200).json({ message: 'Cập nhật thành công', data: updatedSong })
    }catch(error){
        console.error(error)
        return res.status(500).json({ error: 'Lỗi máy chủ. Vui lòng thử lại sau.' })
    }
}