require('../src/db/mongoose')
const allUser=require('../src/models/users')
allUser.findByIdAndUpdate('5e3330aafe69a22d64ef4658',{age:1}).then((user)=>{
  console.log(user)
  return allUser.countDocuments({age:1})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})