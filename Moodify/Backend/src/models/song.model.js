const mongoose = require('mongoose');
const songSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
        default: ""
    },
    title:{
        type:String,
        required:true
    },
    mood:{
        type:String,
        enum:["happy","sad","surprised"]
    }
})

const songModel=mongoose.model("songs",songSchema)
module.exports=songModel
