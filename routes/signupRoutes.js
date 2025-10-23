    const User= require("../model/signupModel")
    const multer  = require('multer')
  
// const upload = multer({ dest: './uploads' })
// above line indicates that the images uploaded by the user will be stored in a folder "uploads",  but this approach courrpts the image making it unable to access thus we use new method , here the folder is made using this line but in new approach first we need to create a folder 

// verifyy = async(req,res)=>{

// const user = await User.findOne({username})
// if(user) {return true}
// else {return false}

// }
// console.log(verifyy())



// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,"./uploads")
//         // req is req obj from user 
//         // file is the file uploaded by the user
//         //  cb  takes 2 args null=> do nothing for error, 2nd arg is the folder name (but we need to make it ourself)
//     },
//     filename: function (req,file,cb){
//         cb(null, Date.now()+file.originalname)
//     }
// })
// console.log(storage)

// const upload = multer({storage})
// console.log(upload)

const express=require("express")
const {handleForgotPassword,createUser, handleUserLogin,handelResetPassword, verifyOtp}=require("../controller/signupController")
const router = express.Router()


// above line uses a method called single used to upload image from "profile" into the(used for one picture)


const upload = multer({storage:multer.memoryStorage()})
//  we handle the file in the routes so that its placed in the buffer storage first as soon as its uploaded
router.post("/createuser", upload.single('profile'),createUser)

router.post("/loginuser",handleUserLogin)
router.post("/forgotPassword", handleForgotPassword)
router.post("/verifyOtp",verifyOtp )
router.post("/resetPassword",handelResetPassword)
module.exports= router

