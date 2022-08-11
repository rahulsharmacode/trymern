const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    phone: {
        type: Number,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    cpassword: {
        type: String,
        required : true
    },
    address: {
        type: String,
        required : true
    },
    work: {
        type: String,
        required : true
    },
    tokens : [
        {
            token : {
                type: String,
                required : true
            }
        }
    ],
    date : {
        type : Date,
        default : Date.now
    }

})


    /* section - token generation all with user instance */
    userSchema.methods.generateAuthToken = async function(){
        const user = this;
        const token = jwt.sign({_id:user._id}, process.env.SECRET_KEY)
        user.tokens = user.tokens.concat({token:token})
        await user.save()
        return token
    }




const User = mongoose.model('user',userSchema);

module.exports = User;