require('../src/db/mongoose')
const allTask=require('../src/models/task')
allTask.findByIdAndDelete('5e3f24200000a223042b08ec').then((task)=>{
  console.log(task)
  return allTask.countDocuments({completed:false})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})