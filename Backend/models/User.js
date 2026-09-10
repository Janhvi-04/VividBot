const mongoose=require('mongoose');
const activitySchema=new mongoose.Schema({
    activityType: {
        type:String,
        enum:['logic-puzzle','curiosity-quest','coding-snippet','mindfulness-task','creative-prompt'],
        required:true
    },
    title:{type:String,required:true},
    details:{type:mongoose.Schema.Types.Mixed},
    timestamp:{type:Date,default:Date.now}
});
const userSchema=new mongoose.Schema({
    name: {type:String, required:true},
    identifier: {type:String, required:true, unique:true},
    otp: {type: String},
    otpExpires: {type:Date},
    lastLogin: {type:Date},
    activityHistory:[activitySchema]
}, {timestamps:true});
module.exports=mongoose.model('User',userSchema);