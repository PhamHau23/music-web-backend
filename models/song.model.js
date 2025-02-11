import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nation: {type: mongoose.Schema.Types.ObjectId, ref: "Nation", required: true},
    genre: {type: mongoose.Schema.Types.ObjectId, ref: "Genres",required: true},
    img: {type: String, required: true},
    imgPublicId: {type: String},
    url: {type: String, required: true},
    mp3PublicId: {type: String},
    view: {type: Number, default: 0},
    singerId: [{type: mongoose.Schema.Types.ObjectId, ref: "Singer"}],
    singerName: [{type: String}],
    album: {type: mongoose.Schema.Types.ObjectId, ref: "Album"},
    duration: {type: Number},
    releaseDate: {type: Date}
},{timestamps: true})

const Song = mongoose.model("Song",songSchema,"songs")

export default Song