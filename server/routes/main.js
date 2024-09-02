
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


router.get('', async (req, res) => {
    const locals = {
        title: "NOdeJs1 Blog",
        description: "simple blog created with NodeJs,Express and emongdb"
    }

    try {


        let perPage = 10;
        let page = parseInt(req.query.page) || 1;

        const data = await Post.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: perPage * (page - 1) },
            { $limit: perPage }
        ]);

        const count = await Post.countDocuments();
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    } catch (error) {
        console.log("ERROr occured");
        console.log(error);
    }
});






//get post by id

router.get('/post/:id', async (req, res) => {

   try{

       const locals={
          title:"NOdeJs1 Blog",
          description:"simple blog created with NodeJs,Express and emongdb"
       }

       let slug = req.params.id;
       const data = await Post.findById(slug);
       res.render('post', { locals, data });

      
   }catch(error){
     console.log("errror OCCURED");
     console.log(error);
   }
});





//get post - searchTerms

router.post('/search', async (req, res) => {

    try{
        const locals={
           title:"NOdeJs1 Blog",
           description:"simple blog created with NodeJs,Express and emongdb"
        }
        let searchTerm=req.body.searchTerm;

        const searchNoSpecialchar = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
        
        const data=await Post.find({
            $or:[
                {title:{$regex:new RegExp(searchNoSpecialchar,'i')}},
                {body:{$regex:new RegExp(searchNoSpecialchar,'i')}}
            ]
        });
        //console.log(searchTerm);
        // res.send(searchTerm);
        res.render("search",{
            data,
            locals
        })
    }catch(error){
      console.log("err OCCURED");
      console.log(error);
    }
 });

// function insertPostData(){
//     Post.insertMany([
//         {
//          title:"Building a Blog",
//          body:"This is the body text"
//         },
//         {
//          title:"Building a Blog",
//          body:"This is the body text"
//         },
//         {
//          title:"Building a Blog",
//          body:"This is the body text"
//         },
//         {
//          title:"Building a Blog",
//          body:"This is the body text"
//         },
//     ])
//  }
//  insertPostData();

// router.get('', async (req, res) => {
//    const locals={
//     title:"NOdeJs1 Blog",
//     description:"simple blog created with NodeJs,Express and emongdb"
//    }


//    try{
//         const data=await Post.find();
//         res.render('index',{locals,data});
//     //    res.render('main')
//        // res.send("Hello harry2");
//    }catch(error){
//      console.log(error);
//    }
// });




router.get('/about', (req, res) => {
    res.render('about');
})

module.exports = router;
