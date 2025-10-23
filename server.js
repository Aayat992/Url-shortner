const express =require('express')
const mongoose= require('mongoose')
const dotenv= require("dotenv")
const urlRoute= require("./routes/urlRoutes")
const path = require("path")
const staticRoute = require("./routes/staticRoute")
  const { restrictToLoggedInUserOnly,
checkAuth,}=require("./middleware/auth")
const cookieParser = require("cookie-parser")
   

const signupRoutes = require("./routes/signupRoutes")


dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

if(!MONGO_URI)
   { console.log("MONGO_URI missing from dotenv")
    process.exit(1);
    //   above  is similar to return as no lines of code will execute after it
   }


app.use(express.json())
app.use(cookieParser())


//  to setup access to ejs
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:true}))   
//  above line is used to parse even complex data to send it from front end to backend


app.use("/url", restrictToLoggedInUserOnly,urlRoute)
app.use("/",checkAuth,staticRoute)
app.use('/user',signupRoutes)



mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("connected to MongoDB")
}).catch(err =>{
    console.log("MongoDB error",err.message)
    process.exit(1)
})
app.listen (PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})