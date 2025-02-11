import mongoose from "mongoose"

const genresSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    img: {type: String, required: true},
    nation: {type: String, ref: "Nation", required: true},
    nationId: {type: mongoose.Schema.Types.ObjectId, ref: "Nation", required: true},
    imgPublicId: {type: String},
    numbVisited: {type: Number, required: true, default: 0}
},{ timestamps: true })

const Genres = mongoose.model('Genres', genresSchema, 'genres')

export default Genres