
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')

const adminlayout='../views/layouts/admin.ejs';

const jwtSecret=process.env.JWT_SECRET;


//Check login

const authMiddleware=(req,res,next)=>{
    console.log("middleware");
    const token=req.cookies.token;
    // console.log(token);
    if(!token){
        //console.log("useless");
        return res.status(401).json({message:'Unauthorized'});
    }

    try{
        const decoded=jwt.verify(token,jwtSecret);
        req.userId=decoded.userId;

        //console.log(req.userId);
        next();
    }
    catch(error){
        res.status(401).json({message:'Unauthorized'});
    }
}



// const authMiddleware = (req, res, next) => {
//     console.log("middleware triggered");

//     // Ensure cookie-parser middleware is applied in your app
//     const token = req.cookies.token;
//     console.log("Token found in cookies:", token);

//     if (!token) {
//         console.log("No token provided, access denied");
//         return res.status(401).json({ message: 'Unauthorized: No token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.userId = decoded.userId;
//         console.log("Token decoded, userId:", req.userId);

//         next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//         console.error("Token verification failed:", error.message);
//         res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }
// }






//get home
//admin login page
router.get('/admin', async (req, res) => {
   
    try {
        const locals = {
            title: "admin",
            description: "simple blog created with NodeJs,Express and emongdb"
        }
        res.render('admin/index', { locals,layout:adminlayout});
    } catch (error) {
        console.log("error admin");
        console.log(error);
    }
});

// post admin-check Login



router.post('/admin',async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user= await User.findOne({username});
        if(!user){
            return res.status(401).json({message:'Invalid credentials'});
        }
        const isPasswordvalid=await bcrypt.compare(password,user.password);
        if(!isPasswordvalid){
            return res.status(401).json({message:'Invalid credentials'});
        }
        const token=jwt.sign({userId:user._id},jwtSecret);
        res.cookie('token',token,{httpOnly:true});

        res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
    }
})






// router.post('/admin',async(req,res)=>{
//     try{
//         const {username,password}=req.body;
//         if(req.body.username==='admin'&& req.body.password==='password'){
//             res.send('You are logged in.');
//         }
//         else{
//             res.send('Wrong username or password');
//         }
//     }
//     catch(error){
//         console.log(error);
//     }
// })


router.get('/dashboard',authMiddleware,async(req,res)=>{
    try{
        const locals={
            title:'Dashboard',
            description:'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data =await Post.find()
        res.render('admin/dashboard',{
            locals,
            data,
            layout:adminlayout,
        });
    }
    catch(error){
        console.log(error);
    }
});



//going into add post


router.get('/add-post',authMiddleware, async(req,res)=>{
    try{
        const locals={
            title:'Add-Posts',
            description:'Simple Blog created with NodeJs,Express & MongoDb'
        }

        const data=await Post.find();
        res.render('admin/add-post',{
            locals,
            data,
            layout:adminlayout
        })
       
    }
    catch(error){
        console.log(error);
    }
})

//add a new post 


router.post('/add-post',authMiddleware, async(req,res)=>{
    try{
        try{
           const newPost=new Post({
             title:req.body.title,
             body:req.body.body
           })
           await Post.create(newPost);
           res.redirect('/dashboard');
        }
        catch(error){
           console.log(error);
        }
    }
    catch(error){
        console.log(error);
    }
})



// get edit-post 

router.get('/edit-post/:id',authMiddleware,async(req,res)=>{
    try{
        console.log("lion Entered");
        const locals={
            title:"Edit-Post",
            description:"NodeJS user Management System",
        }
        const data=await Post.findOne({_id:req.params.id});
        res.render('admin/edit-post',{
            locals,
            data,
            layout:adminlayout
        })
    }
    catch(error){
        console.log(error);
    }
})













//edit-post by put

router.put('/edit-post/:id',authMiddleware,async(req,res)=>{
    try{
        console.log("lioness entered");
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });        
        res.redirect(`/edit-post/${req.params.id}`);
    }
    catch(error){
        console.log(error);
    }
})




//delete post by admin

router.delete('/delete-post/:id',authMiddleware,async(req,res)=>{
    try{
       console.log("You are great");
       await Post.deleteOne({_id:req.params.id});
       res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
    }
})


//admin logout

router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    // res.json({message:"LogoutSuccessful"});
    res.redirect('/');
})





router.post('/register',async(req,res)=>{
    try{
        const {username,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);

        try{
            const user=await User.create({username,password:hashedPassword});
            res.status(201).json({message:'User Created',user});
        }
        catch(error){
            if(error.code===11000){
                res.status(409).json({message:'User already in use'});
            }
            res.status(500).json({message:"Internal server error"});
        }
    }
    catch(error){
        console.log(error);
    }
})

module.exports = router;