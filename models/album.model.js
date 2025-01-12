import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    genre: {type: String, ref: "Genres"},
    singer: {type: mongoose.Schema.Types.ObjectId, ref: "Singer"},
    releaseDate: {type: Date}
},{timestamps: true})

const Album = mongoose.model("Album",albumSchema,"albums")

export default Album