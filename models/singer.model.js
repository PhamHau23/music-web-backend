import mongoose from "mongoose";

const singerSchema = new mongoose.Schema({
    slug: String,
    name: {type: String, required: true},
    nation: {type: String, ref: "Nation", required: true},
    address: {type: String},
    img: {type: String, required: true},
    birthDate: {type: Date},
    albums: [{type: mongoose.Schema.Types.ObjectId, ref: "Album"}],
    view: {type: Number, default: 0}
}, {timestamps: true})

const Singer = mongoose.model('Singer',singerSchema,'singers')

export default Singer