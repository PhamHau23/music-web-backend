import mongoose from "mongoose";

// Định nghĩa schema cho Nation
const nationSchema = new mongoose.Schema({
    id: {type: String, required: true},
    img: {type: String, required: true},
    name: {type: String, required: true},
    numVisited: {type: Number, default: 0}
},{ timestamps: true })
  
// Tạo model từ schema
const Nation = mongoose.model('Nation', nationSchema, 'nation')
  
export default Nation;
  