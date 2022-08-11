const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    discription : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    category : {
        type : String,
        required : true,
    },
    image: {
        type:String,
        required:false
    },
    auther : {
        type : String,
        required : false,
    },
    date : {
        type : Date,
        default : Date.now
    }
})

const Products =  mongoose.model('PRODUCT', productSchema)

module.exports = Products