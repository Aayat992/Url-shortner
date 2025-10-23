const express= require("express")
const router = express.Router()
const {createShortUrl,redirectUrl}= require("../controller/myController")
//  handle form submission
router.post("/",createShortUrl)
router.get("/:id",redirectUrl)
// handle redirection 
module.exports= router;