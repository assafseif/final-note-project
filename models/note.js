import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creator :{
        type: Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    hashtags :[{
        type: Schema.Types.ObjectId,
        ref:'Hashtag',
        required: false
    }]

}

    ,
    { timestamps: true }

)


export default mongoose.model('Note', noteSchema);