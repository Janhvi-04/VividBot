const express=require('express');
const router=express.Router();
const nodemailer=require('nodemailer')
const User=require('../models/User')
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
router.post('/send-otp',async(req,res)=>{
    const {name,identifier}=req.body;
    if(!name || !identifier) {
        return res.status(400).json({error:"Name and email address are required."})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
        return res.status(400).json({error:"Please enter a valid email address."})
    }
    try {
        const mailboxLayerApiKey = process.env.MAIL_BOX_LAYER;
        if (mailboxLayerApiKey) {
            const apiResponse = await fetch(`https://apilayer.net/api/check?access_key=${mailboxLayerApiKey}&email=${encodeURIComponent(identifier)}`);
            const data = await apiResponse.json();
            if (!data.format_valid || !data.mx_found || !data.smtp_check) {
                return res.status(400).json({ error: "This email address does not exist or cannot receive mail." });
            }
        }
        let user = await User.findOne({ identifier });
        if (!user) {
            user = new User({ identifier, name });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await transporter.sendMail({
            from: `"VividBot" <${process.env.EMAIL_USER}>`,
            to: identifier,
            subject: 'Your VividBot Verification Code',
            text: `Hello ${name},\n\nYour OTP for VividBot login is: ${otp}\nThis code expires in 10 minutes.`
        });
       user.name = name;
       user.otp = otp;
       user.otpExpires = otpExpires;
       await user.save();
       res.json({ success: true, message: `OTP sent successfully to ${identifier}!` });
    } catch (err) {
        console.error("Server error:",err.message);
        res.status(500).json({error:"Server error. Please try gain later."});
    }
})
router.post('/verify-otp',async(req,res)=>{
    const {identifier,otp}=req.body;
    if(!identifier || !otp) {
        return res.status(400).json({error:"Email and OTP are required."})
    }
    try {
        const user=await User.findOne({identifier})
        if(!user || user.otp!==otp) {
            return res.status(400).json({error:"Invalid OTP.Please check and try again."})
        }
        if(user.otpExpires<new Date()) {
            return res.status(400).json({error:"OTP has expired. Request a new one."})
        }
        user.otp=undefined;
        user.otpExpires=undefined;
        user.lastLogin=new Date();
        await user.save();
        res.json({
            success:true,
            message:"Login successful!",
            user:{name:user.name,identifier:user.identifier,lastLogin:user.lastLogin}
        })
    } catch (err) {
        res.status(500).json({error:err.message})
    }
})
module.exports=router;