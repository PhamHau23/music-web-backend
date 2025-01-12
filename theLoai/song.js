import { connectDB } from "../configs/mongoDb.js";
import slugify from "slugify";
import Genres from "../models/genres.model.js";
import Nation from "../models/nation.model.js";
import Singer from "../models/singer.model.js";
import Song from "../models/song.model.js";
import path from 'path'
import * as mm from 'music-metadata'
import fs from 'fs'
import { fileURLToPath } from 'url';
import axios from "axios";

const song = [
    {
        name: 'tây lâu biệt tự',
        nation: 'cn',
        genre: 'cnpop',
        img: 'https://res.cloudinary.com/dtzqisgc8/image/upload/v1734331971/webMusic/baihat/cn/taylaubiettu_xexfmr.jpg',
        url: 'https://res.cloudinary.com/dtzqisgc8/video/upload/v1734331861/webMusic/mp3/cn/T%C3%A2y_L%C3%A2u_Bi%E1%BB%87t_T%E1%BB%B1_Do%C3%A3n_T%C3%ADch_Mi%C3%AAnTi%E1%BB%83u_%C4%90i%E1%BB%81n_%C3%82m_Nh%E1%BA%A1c_X%C3%A3_%E8%A5%BF%E6%A5%BC%E5%88%AB%E5%BA%8F_%E5%B0%B9%E6%98%94%E7%9C%A0%E5%B0%8F%E7%94%B0%E9%9F%B3%E4%B9%90%E7%A4%BE_owxags.mp3',
        singerName: ['doãn tích miên'],
    },
    {
        name: 'bạch nguyệt quang và nốt chu sa',
        nation: 'cn',
        genre: 'cnpop',
        img: 'https://res.cloudinary.com/dtzqisgc8/image/upload/v1734331978/webMusic/baihat/cn/bachnguyetquang_shslaq.jpg',
        url: 'https://res.cloudinary.com/dtzqisgc8/video/upload/v1734331673/webMusic/mp3/cn/B%E1%BA%A1ch_Nguy%E1%BB%87t_Quang_V%C3%A0_N%E1%BB%91t_Chu_Sa_%C4%90%E1%BA%A1i_T%E1%BB%AD_%E7%99%BD%E6%9C%88%E5%85%89%E4%B8%8E%E6%9C%B1%E7%A0%82%E7%97%A3_%E5%A4%A7%E7%B1%BD_vd828l.mp3',
        singerName: ['đại tử']
    },
    {
        name: 'gói gọn hồi ức trao cho anh',
        nation: 'cn',
        genre: 'cnpop',
        img: 'https://res.cloudinary.com/dtzqisgc8/image/upload/v1734331982/webMusic/baihat/cn/goigonhoiuc_rndknt.jpg',
        url: 'https://res.cloudinary.com/dtzqisgc8/video/upload/v1734331731/webMusic/mp3/cn/G%C3%B3i_G%E1%BB%8Dn_H%E1%BB%93i_%E1%BB%A8c_Trao_Cho_Anh_V%C6%B0%C6%A1ng_Nh%E1%BB%8B_L%C3%A3ng_%E6%8A%8A%E5%9B%9E%E6%86%B6%E6%8B%BC%E5%A5%BD%E7%B5%A6%E4%BD%A0_%E7%8E%8B%E8%B4%B0%E6%B5%AA_wkbl8w.mp3',
        singerName: ['vương nhị lãng']
    },
    {
        name: 'come back to me',
        nation: 'kr',
        genre: 'krpop',
        img: 'https://res.cloudinary.com/dtzqisgc8/image/upload/v1734332415/webMusic/baihat/kr/comebacktohome_xg5pmi.jpg',
        url: 'https://res.cloudinary.com/dtzqisgc8/video/upload/v1734332483/webMusic/mp3/kr/RM_Come_back_to_me_Official_MV_wrvvgm.mp3',
        singerName: ['RM'],
        releaseDate: '05/10/2024'
    },
    {
        name: 'earth wind and fire',
        nation: 'kr',
        genre: 'krpop',
        img: 'https://res.cloudinary.com/dtzqisgc8/image/upload/v1734332417/webMusic/baihat/kr/Earth_Wind_Fire_fy35yn.jpg',
        url: 'https://res.cloudinary.com/dtzqisgc8/video/upload/v1734332449/webMusic/mp3/kr/BOYNEXTDOOR_%EB%B3%B4%EC%9D%B4%EB%84%A5%EC%8A%A4%ED%8A%B8%EB%8F%84%EC%96%B4_Earth_Wind_Fire_Official_MV_Performance_ver_szszyn.mp3',
        singerName: ['boynextdoor'],
        releaseDate: '04/15/2024'
    }
]

const addSong = async() => {
    await connectDB()
    for(const item of song){
        const nation = await Nation.findOne({id: item.nation})
        const genre = await Genres.findOne({id: item.genre})
        const singerId = []
        const singerName = []
        for(const singerName1 of item.singerName){
            const slug = slugify(singerName1, {lower: true})
            const singer = await Singer.findOne({slug: slug})
            if(singer){
                singerId.push(singer._id)
                singerName.push(singer.name)
            }else{
                singerName.push(singerName1)
            }
        }

        if(nation && genre){
            const songData = ({
                name: item.name,
                nation: nation._id,
                genre: genre._id,
                img: item.img,
                url: item.url,
                singerId,
                singerName,
                releaseDate: item.releaseDate
            })
            await Song.create(songData)
        }
    }
}

const __filename = fileURLToPath(import.meta.url);

async function getDurationFromUrl(fileUrl) {
    try {
      // Tải file từ URL
      const response = await axios({
        method: "get",
        url: fileUrl,
        responseType: "arraybuffer", // Tải file dưới dạng arraybuffer
      });
  
      // Chuyển đổi arraybuffer thành buffer
      const buffer = Buffer.from(response.data);
  
      // Phân tích metadata từ buffer
      const metadata = await mm.parseBuffer(buffer, null, {
        duration: true,
      });
  
      console.log(`Duration: ${metadata.format.duration} seconds`);
      return metadata.format.duration;
    } catch (error) {
      console.error(`Error fetching or parsing the file: ${error.message}`);
      return null;
    }
  }
  
  async function updateSongDurations() {
    const songs = await Song.find(); // Lấy tất cả các bài hát trong MongoDB
  
    for (const song of songs) {
      try {
        if (!song.url) {
          console.warn(`Missing URL for song: ${song.name}`);
          continue;
        }
  
        // Lấy duration từ URL
        const duration = await getDurationFromUrl(song.url);
  
        if (duration) {
          song.duration = Math.round(duration); // Làm tròn thời lượng (giây)
          await song.save(); // Lưu thay đổi vào MongoDB
          console.log(`Updated: ${song.name} - Duration: ${song.duration}s`);
        } else {
          console.warn(`Unable to get duration for song: ${song.name}`);
        }
      } catch (error) {
        console.error(`Error updating song: ${song.name}`, error);
      }
    }
    console.log("Update hoàn tất!");
  }
  
  export default updateSongDurations;