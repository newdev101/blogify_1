const {Router} = require('express');
const User = require('../models/user');

const router = Router();




//home
// router.get('/',(req,res)=>{
//      return res.render('home');
// });


//signin
router.get('/signin',(req,res)=>{
     return res.render('signin');
});


//signup
router.get('/signup',(req,res)=>{
     return res.render('signup');
});


//signup post
router.post('/signup',async(req,res)=>{
     const {fullName, email, password} = req.body;
     console.log(fullName, email, password);
     await User.create({
          fullName,
          email,
          password,
     });
     return res.redirect('/');
});


//signin post

//async and await is mandatory because the matchPasswordAndGenerateToken() is async
router.post('/signin', async (req, res) => {
     const { email, password } = req.body;
     try {          
         const token = await User.matchPasswordAndGenerateToken(email, password);
     //     console.log("Token received:", token);
 
         // Handle the token or redirect as needed
         return res.cookie('token',token).redirect('/');
     } catch (error) {
         console.error("Error:", error.message);
         // Handle the error, redirect, or send an error response
         return res.status(500).render('signin',{
          error:"incorrect email or password",
         });
     }
 });


 //logout
 router.get('/logOut',(req,res)=>{
     return res.clearCookie('token').redirect('/');
 });

module.exports=router;

