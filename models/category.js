import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
       type :String,
       unique:true,
       required:true
    },
    counter :{
        type:Number,
        required:true,
        default:1
      },
    creator :{
      type: Schema.Types.ObjectId,
      ref:'Category',
      required: true
  }
 }
    ,
    
    {timestamps: true,}

)


export default mongoose.model('Category', categorySchema);