const express=require('express')
const SpecificUser=require('../models/users')
const multer=require('multer')
const sharp=require('sharp')
const router=new express.Router()
const auth=require('../middleware/auth')
const {sendWelcomeEmail, sendCnacelationEmail}=require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new SpecificUser(req.body)
    try{
        await user.save();
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req,res)=>{
    try{
        const user=await SpecificUser.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e) 
    }
})

router.get('/users/logout',auth, async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/logoutAll',auth, async(req,res)=>{
    try{
        
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth, async (req, res) => {

    res.send(req.user)
})
router.patch('/users/me',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=['name','email','password','age']
    const isallowOperation=updates.every((update)=>allowUpdates.includes(update))
    if(!isallowOperation){
        return res.status(400).send({"error":"Invalid Updates!"})
    }
    try{
        
        updates.forEach((update) => req.user[update]=req.body[update])
        await req.user.save()

         res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth,async (req,res)=>{
    try{
        // const user=await SpecificUser.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCnacelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})
const upload=multer({
    limits:{
        fileSize:1000000    
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a image'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
  
  const buffer=await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer();  
  req.user.avatar=buffer
  await req.user.save()
 res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
   const user=await SpecificUser.findById(req.params.id)
   if(!user||!user.avatar){
    throw new Error()
   }
   res.set('content-type','image/png')
   res.send(user.avatar)
    }catch(e){

    }
})
module.exports=router