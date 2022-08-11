const express = require('express');
const dotenv = require('dotenv');
// const cors = require('cors')
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')

const userRouter = require('./routes/userRouter');


app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit : 500000 }))
app.use(bodyParser.json({ limit: "50mb" }))
// app.use(express.json({limit : '50mb'}))
app.use(userRouter)
// app.use(cors())


app.use(express.static("./public/")); // default file path for store and get file


require('./db/config')
require('./routes/userRouter')
require('./middelware/authentication')


/* section - */
dotenv.config({
    path : './config.env'
})




/* section - */

app.get('/', (req,res)=>{
    res.send('Hellow server')
})




/* section - */

PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`)
})


