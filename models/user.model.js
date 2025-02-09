import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    img: {type: String},
    role: {type: String, default: 'user'},
    timeLog: {type: Date}
},{timestamps: true})

const User = mongoose.model("User",userSchema,"user")

export default User