const express = require('express');
const userRouter = new express.Router()

const User = require('../model/userSchema');
const Products = require('../model/productSchema');
const Images = require('../model/uploadSchema');

const mongoose = require('mongoose');



const multer  = require('multer')
// const upload = multer({dest : 'upload/'})

const Authentication = require('../middelware/authentication');
const { model } = require('mongoose');


/* section - Disk storage engien by multer  */

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });

  const fileFilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
        cb(null,true);
    }else{
        cb(null, false);
    }
 
   }
 
 var upload = multer({ 
     storage:storage,
    //  limits:{
    //      fileSize: 1024 * 1024 * 5
    //  },
    //  fileFilter:fileFilter
  });
/* -- section - Disk storage engien by multer ends -- */




/* section - upload image api */
// userRouter.post('/product',upload.single('productImage') ,Authentication   , async (req,res)=>{
//     try{
//         var product_name=req.body.name;
//     const uploadImg = new Images({
//         _id:mongoose.Types.ObjectId(),
//         name : product_name,
//         discription : req.body.discription,
//         price : req.body.price,
//         category : req.body.category,
//         image:req.file.filename
//     })
//     const responseUpload = await uploadImg.save();
//     if(!responseUpload){
//     res.status(400).json({message : 'product not uploaded'})
//     }

//     res.status(200).json({message : 'product uploaded'})

//     }
//     catch(err){
//     res.status(401).json({message : 'product not uploaded'})

//         console.log('err---' , err)

//     }
// })

/* section - fetch image api */
userRouter.get('/upload', async(req,res)=>{
   try{
    let fetchImg = await  Images.find()
    if(!fetchImg){
        res.status(400).json({message : "no images found"})
    }
    res.status(200).json({message : "images found", data :fetchImg })
   }
   catch(err){
    res.status(401).json({message : "no images found"})
   }

})



/* section - register api */

userRouter.post('/register', async (req,res)=>{
    const {name,email,phone,password,cpassword,address,work} = req.body;
    if(!name || !email || !phone || !password || !cpassword || !address || !work){
        return res.status(401).json({message : "some fields are missing"})
    }
    else if(password !== cpassword){
        return res.status(401).json({message : "some data missmatch"})
    }
    try{
        const user = await User.findOne({email:email})
        if(user){
            res.status(401).json({message : "email already existed"})
        }

        else{
           let registerUser = new User(req.body);
           let dataResponse = await registerUser.save();
           res.status(200).json({status:true,message : "user registered", dataResponse})
           
        }
        
    }
    catch(err){
        res.send(err)

    }
})


/* section - login api */

userRouter.post('/login', async(req,res)=>{
    
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({message : "some fields are missing"})
        }

        else{
                const user  = await User.findOne({email})
                if(!user){
                res.status(401).json({status:false,message : "failed to login"})
                }
                else{
                    const userPass = user.password;
                    if(userPass === password){

                        /* section - token function all with user instance */
                        const token = await user.generateAuthToken();
                        console.log(token)

                        res.status(200).json({status:true, message : "login succeed", token :token})

                    }

                    else{
                        res.status(402).json({status:false,message : "failed to login"})
                    }
                }
        }
    }
    catch(err){
        res.status(401).json({status:false,message : "failed to login", err,})
    }
})

/* section - about api */
userRouter.get('/about', Authentication ,async (req,res)=>{
    res.status(201).json({status:true, userdata : req.rootUser})
})

/* section - product register api */
userRouter.post('/product', Authentication , upload.single('productImage') , async (req, res) =>{
        try{
            let {name, discription, price, category} = req.body;

            if(!name || !discription || !price || !category){
                return res.status(405).json({status:false, message : "some filed are missing"})
            }
            const auther = req.rootUser;
            const image = req.file.filename;
            const productItem = new Products({
                name, discription, price, category , image ,auther
            })
            const responseItem = await productItem.save()
            if(!responseItem){
                res.status(404).json({status:false, message : "product not saved"})
            }
            res.status(405).json({status:true, message : "product saved"})
        }
        catch(err){
            console.log(err)
        }
})

/* section - all product  api */
userRouter.get('/product' , Authentication , async (req,res)=>{

        const page = req.query.page || 0;
        const perPage = 3;


        const productsData = await  Products.find().skip(page * perPage).limit(perPage);

        
        if(productsData){
            res.status(200).json({status:true, message : "products list", productsData})
        }


})

/* section - product update api */
userRouter.put('/product/:id', Authentication , upload.single('productImage') , async (req,res)=>{ 
    console.log(req.body.name , 'requested')
    console.log(req.params.id , 'params')

    try{
        const image = req.file.filename;
        const updateProduct   = await Products.findOneAndUpdate({_id:req.params.id},{
            // $set : req.body
            $set : {
                name : req.body.name,
                discription : req.body.discription,
                price : req.body.price,
                category : req.body.category,
                image : image
            }

        })
        if(!updateProduct){
            res.status(400).json({status:false,message:"product update failed"})
        }
        res.status(200).json({status:true,message:"product updated"})

    }
    catch(err){
        res.status(401).json({status:false,message:"product not found"})
    }
})

/* section - product delete api */
userRouter.delete('/product/:id', Authentication , async (req,res)=>{
    console.log(req.params.id)
    try{

        const allproduct = await Products.findByIdAndDelete({_id:req.params.id})
        if(!allproduct){
            res.status(404).json({status:false,message:"product not found"})
        }
        res.status(200).json({status:true,message:"product deleted"})
        

    }
    catch(err){
        res.status(401).json({status:false,message:"product not found"})
    }
})

/* section - product search api */
userRouter.get('/product/:key', Authentication , async (req,res)=>{
    console.log(req.params.id)
    try{

        const searchproduct = await Products.find({
            "$or" : [
                {name : {$regex : req.params.key}}
            ]
        })
        if(!searchproduct){
            res.status(404).json({status:false,message:"no result found"})
        }
        res.status(200).json({status:true,message:"result found", searchproduct})
        

    }
    catch(err){
        res.status(401).json({status:false,message:"no result found"})
    }
})








module.exports = userRouter;