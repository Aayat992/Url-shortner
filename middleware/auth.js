const {getUser}= require("../services/auth")
 async function restrictToLoggedInUserOnly(req,res,next){
    const userUid = req.cookies?.uid;
// used to access the id created by uuid v4

    if(!userUid) return res.redirect("/login")
    const user= getUser(userUid)

    if(!user) return res.redirect("/login")
    req.user = user
    next()
 }
 async function checkAuth(req,res,next){
    const userUid =req.cookies?.uid;
    const user = getUser(userUid)
    req.user = user
    next()
 }
 module.exports= {
    restrictToLoggedInUserOnly,
    checkAuth,
 }