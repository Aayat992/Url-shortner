
const User= require("../model/signupModel")
const {v4:uuidv4}= require("uuid")
const {setUser} = require('../services/auth')
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)
const nodemailer = require('nodemailer')
require('dotenv').config();
const jwt = require("jsonwebtoken")
const logger = require('../services/log')
const path = require("path")
const fs = require("fs")


createUser = async(req,res)=>{
    try{ // console.log(req.file) seperate object to access the file uploaded by the user
    // console.log(req.body) only contains form filled data not the files
    const file= req.file
    const{username, email} =req.body 
    const salt = bcrypt.genSaltSync(10)
    console.log(salt)
    const password = bcrypt.hashSync(req.body.password,salt)
    console.log(password)

    if(!username || !password ||!email ||!file ){
        return res.status(400).json({error:"all fields are required"})
    }
const user =  await User.findOne( {$or: [{username},{email}] })
if(user){
    return res.render('signup',{error:"username or email already exists"})
}
const uplaodDir = path.join(__dirname,"../uploads")
if(!fs.existsSync(uplaodDir)){
fs.mkdirSync(uplaodDir,{recursive:true})
}
const profile =Date.now() + "_" + file.originalname
const filepath = path.join(uplaodDir, profile)
// above line is showing  the profile varable (string ) where it is to be stored 

fs.writeFileSync(filepath,file.buffer)
//  is used to access the file from the storage (used via multer)



    await User.create({
        username,
        email,
        password,
        profile
    })
    
   
    return res.render('login',{error:null, message:"SIGN UP DONEE , please log in "})}
    catch(error){
        logger.error("this is error during signup",error)
        return res.status(500).json({error:"username or email already exists" })
    }
}

 
handleUserLogin = async(req,res)=>{
    const{username}= req.body
const user = await User.findOne({username})

if(!user || !bcrypt.compareSync(req.body.password, user.password)){
    return res.render("login", {
        error:"invalid username or password",
        message:null
    })
}
const sessionId = uuidv4()
setUser(sessionId,user)
res.cookie("uid", sessionId)

return res.redirect("/")

}

handleForgotPassword = async(req,res)=>{
    const {email}= req.body
    if(!email){
        return res.status(400).json({error:"email is required"})
    }
    const user =  await User.findOne({email})
    //here we are searching for the user in the DB based on email
    if(!user) return res.status(400).json({error:"user not found"})
//  genreate a password reset token  and send it to users email
    // console.log(process.env.email_user, process.env.email_pass);
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user:process.env.email_user,
    //  above we write the name of the account used to send the email
    pass: process.env.email_pass
    // pass provides acces inorder for the email to be sent using the above specified account 
  },
});

let  otp =  Math.floor(1000 + Math.random()*9000).toString();
// to save the otp and expiration time in the DB 
user.passwordResetToken= otp
 user.passwordResetExpires=Date.now()+10*60*1000
 await user.save()
const info = await transporter.sendMail({
    from:process.env.email_user,
    to:user.email,
    subject:"OTP for the passwrd reset",
    text:`your OTP is ${otp}`
})
// console.log(info)

//  to the verifyOtp ejs we are also sending the email such that we access  it in the verifyOtp method by submittng along  the  verify FORM(chcek ejs)
res.render('verifyOtp',{email:user.email})

}

verifyOtp = async(req,res)=>{
    const { email, otp }=req.body
    const user = await User.findOne({email,
        passwordResetToken:otp,
        passwordResetExpires:{$gt : Date.now()}
        // above line is used to check if the value for current date and time is greater than the  expiry in the database if so the OTP will no longer be valid
    })
    
    
    
// if the time limit is not crossed token is created, ==> reset password was accessed within time 
// .OTP is only used once to prove identity.

// After verification, you issue a short-lived JWT (e.g. 10 minutes),This JWT becomes the “ticket” that allows the user to access the reset form. NO NEED TO STORE ANYTHING IN MEMORY
// OTP can’t be reused because after issuing JWT, you usually clear passwordResetToken and passwordResetExpires from DB.(CHECK RESET METHOD)
// On the reset password request, you just run jwt.verify() → if valid, proceed.
// 

 if(!user) return res.status(400).json({error:"user not found"})
      
const authToken = jwt.sign(
            { email:user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: '10m' }  // Token expires in 10 minutes
        );
        res.render("resetPassword",{authToken:authToken})
    //     if(!user) return res.status(400).json({error:"user not found"})
    //   res.render("resetPassword",{authToken:authToken})   
}



handelResetPassword = async(req,res)=>{
const {newPassword ,confirmedPassword ,authToken} = req.body
if(!newPassword|| !confirmedPassword){
    return res.status(400).json({error:"all fields are required"})
}
if(newPassword !== confirmedPassword){
        return res.status(400).json({error:"passwords do not match"})
}
try{
const decoded =jwt.verify(authToken,process.env.JWT_SECRET)
 const user = await User.findOne({email:decoded.email})
 if(!user){
            return res.status(400).json({error:"Session expired ,try again"})
 }
 const salt = bcrypt.genSaltSync(10)
 const hashedpassword = bcrypt.hashSync(newPassword,salt)
//   to save the password in the variable "user"
 user.password = hashedpassword
//  to save the password in the data base
 await user.save()
//   as we have the only have  one store variable this will  cause an error if multiple users try to reset 
 

 return res.redirect("/login")}
 catch(err){
    return res.status(401).json({error:"invalid or expired token "})
 }
}

module.exports={createUser,handleUserLogin,handleForgotPassword,verifyOtp,handelResetPassword}

