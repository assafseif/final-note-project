import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const hashtagSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
      },
      counter :{
        type:Number,
        required:true,
        default:1
      }
    }
    ,
    {
        timestamps: true,
    }

)


export default mongoose.model('Hashtag', hashtagSchema);