const Url = require('../model/myModel');
const {nanoid}= require("nanoid")
//  above line is used to create an ID which we will STORE IN THE DB with the OG Url to acces and redirect it

exports.createShortUrl= async(req,res)=>{
try{
const {originalUrl}= req.body
const shortId = nanoid(6)

await Url.create({originalUrl: originalUrl,shortId:shortId, createdBy:req.user._id})
 const allUrls =  await Url.find({createdBy:req.user._id})
res.render("home",{
    id:shortId,
    url: allUrls,
})
}catch(error){
   console.log("error in creating short URl", error.message) 
   res.status(500).send("Internal server error")
}
}

exports.redirectUrl = async(req,res)=>{
try{
const {id}= req.params
const record= await Url.findOne({shortId:id})
if(record){
    res.redirect(record.originalUrl)
}else{
    res.status(404).send('URl not found')
}
}catch(err){
    res.status(500).send("server error")
}
}