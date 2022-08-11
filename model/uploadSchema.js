const mongoose  = require('mongoose')

const imageSchema = new mongoose.Schema({
    name : {
        type :String,
        required : true

    },
    image: {
            type:String,
            required:true
    },
    date:{
        type: Date, 
        default: Date.now 
    }
})

const Images = mongoose.model('images' , imageSchema)

module.exports = Images;