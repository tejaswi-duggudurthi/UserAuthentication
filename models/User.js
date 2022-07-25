import mongoose from 'mongoose'

const userSchema =  new mongoose.Schema({
    username:{type: String, required: true,unique:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    time:{type:Date,default:Date.now}
},{
    collection:'userdata'
})


const model = mongoose.model('user',userSchema)
export default model