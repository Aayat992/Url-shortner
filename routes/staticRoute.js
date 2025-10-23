const express= require('express')
const URL =require("../model/myModel")
const router = express.Router()
router.get("/", async(req,res)=>{
    try{
 if(!req.user) return res.redirect('/login');
const allUrls= await URL.find({ createdBy: req.user._id});
return res.render("home",{
    url:allUrls,
    message:`wlcomee ${req.user.username}`
})

    }catch(error){
        console.log("error fetching urls",error)
    return res.status(500).json({
        message:"error fetching",
        error:error.message

    })
    
    
    }
})


router.get('/signup',(req,res) => {
return res.render("signup",{error:null} )
})

router.get("/login",(req,res)=>{
    return res.render("Login", {error:null, message :null})
})
router.get('/forgotPassword',(req,res)=>{
    return res.render('forgotPassword')
})

module.exports= router;