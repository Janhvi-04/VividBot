const express=require('express');
const router=express.Router();
const User=require('../models/User');
 router.post('/log',async(req,res)=>{
    const {identifier,activityType,title,details}=req.body;
    if(!identifier || !activityType || !title) {
        return res.status(400).json({error:"Missing required fields."})
    }
    try {
        const user=await User.findOne({identifier});
        if(!user) {
            return res.status(404).json({error:"User not found."})
        }
        const formattedType = activityType.replace(/-/g, ' ');
        user.activityHistory.push({
            activityType,
            title:`Attempted ${formattedType}`,
            details:details || {},
            timestamp:new Date()
        });
        await user.save();
        res.status(200).json({success:true})
    } catch(err) {
        console.error("Activity Log Error:",err.message);
        res.status(500).json({error:"Server error while logging history."})
    }
 });
 router.get('/history/:identifier',async(req,res)=>{
    try{
        const user=await User.findOne({identifier:req.params.identifier});
        if(!user) {
            return res.status(404).json({error:"user not found."});
        }
        res.json({success:true,history:user.activityHistory});
    } catch(Err) {
        res.status(500).json({error:"Server error while fetching history."})
    }
 })
 module.exports=router;
 