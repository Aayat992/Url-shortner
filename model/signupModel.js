const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    username:{type:String,required: true,unique:true},
    password:{type:String,required: true},
    email:{type:String,required: true,unique:true},
    profile:{type:String,required:true},
    passwordResetToken:{type:String},
    passwordResetExpires:{type:String},
})
module.exports= mongoose.model("User",schema)