const express = require("express")
const router = express.Router()
const passport = require("passport")
const app = express()

const Product = require("../models/Product")

router.get("/login",(req,res,next)=>{
    res.render("login")
})
router.post("/login", passport.authenticate("local-login" ,{
    successRedirect:"/",
    failureRedirect:"/login",
    passReqToCallback:true
}))

router.get("/register",(req,res,next)=>{
    res.render("register")
})
router.post("/register", passport.authenticate("local-register",{
    successRedirect:"/",
    failureRedirect:"/register",
    passReqToCallback:true
}))
router.get('/logout', (req, res, next) => {
    res.redirect('/login');
    req.session.destroy()
  });
router.get("/", isAuthenticated,async(req,res,next)=>{
    let datos = req.user
    let datosProducts = await Product.find({}).lean()
    const {alias} = datos

    res.render("index",{alias,datosProducts})
})
router.post("/",async(req,res,next)=>{
    const {title,price,thumbnail} =req.body
    const newProduct = new Product()
    newProduct.title = title
    newProduct.price = price
    newProduct.thumbnail = thumbnail
    await newProduct.save()
    res.redirect("/")
})
router.get("/profile", isAuthenticated ,(req,res,next)=>{
    let datos = req.user
    const {email,firstName,lastName,alias,edad,direccion,creationDate,phone} = datos
    const sesionId = req.session.id
    res.render("profile",{sesionId, email,alias,edad,direccion,creationDate,phone,firstName,lastName })
})

function isAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}


module.exports = router