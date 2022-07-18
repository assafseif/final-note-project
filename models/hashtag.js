import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const hashtagSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
      }
    }
    ,
    {
        timestamps: true,
    }

)


export default mongoose.model('Hashtag', hashtagSchema);