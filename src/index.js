const express = require('express')
require('./db/mongoose')
const SpecificUser = require('./models/users')
const SpecificTask = require('./models/task')
const userRouter=require('./routers/users')
const taskRouter=require('./routers/tasks')
const app = express()
const port = process.env.port

// const multer=require('multer')
// const upload=multer({
//     dest:"images",
//     limits:{
//         fileSize:1000000    
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word file'))
//         }
//         cb(undefined,true)
//     }
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//  res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up and running on port' + port)
}
)