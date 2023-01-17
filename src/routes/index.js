const express = require("express")
const router = express.Router()
const passport = require("passport")
const multer  = require('multer')
const configMemoryStorage = multer.memoryStorage()
const upload = multer({ storage: configMemoryStorage})
const sharp = require("sharp")
const fs = require("fs")
const Product = require("../models/Product")
const INFO = require("../utils/info")
const { fork } = require("child_process")

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
router.get("/profile", isAuthenticated ,(req,res)=>{
    let datos = req.user
    const {email,firstName,lastName,alias,edad,direccion,creationDate,phone,_id} = datos
    const avatarImageId = `uploads/${_id}.png`
    const sesionId = req.session.id
    res.render("profile",{sesionId, email,alias,edad,direccion,creationDate,phone,firstName,lastName,avatarImageId,_id})
})
router.post("/profile",upload.single('avatar'),async (req,res,next)=>{
    let datos = req.user
    const {email,firstName,lastName,alias,edad,direccion,creationDate,phone,_id} = datos

    const avatar = req.file

    const proccesedAvatar = sharp(avatar.buffer)
    const resizeAvatar = proccesedAvatar
    const resizeAvatarBuffer = await resizeAvatar.toBuffer()
    fs.writeFileSync(`public/uploads/${_id}.png`,resizeAvatarBuffer)
    const avatarImageId = `uploads/${_id}.png`

    res.render("profile",{email,firstName,lastName,alias,edad,direccion,creationDate,phone,avatarImageId})
    
})
router.get("/info", (req,res)=>{
    const data = INFO
    res.render("info", {data})
})
router.get("/api/randoms", (req,res)=>{
    const cant = req.query.cant || 500000000
    const subProcess = fork("randomNumbers.js")

    subProcess.send(cant)
    subProcess.on("message",(cant)=>{
        res.send({cant})
    })
})
function isAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}


module.exports = router