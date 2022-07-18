import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
       type :String,
       unique:true,
       required:true
    }
 }
    ,
    
    {timestamps: true,}

)


export default mongoose.model('Category', categorySchema);