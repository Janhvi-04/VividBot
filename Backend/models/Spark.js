const mongoose=require('mongoose');
const sparkSchema=new mongoose.Schema({
    dta:{type:String,required:true,unique:true},
    logicPuzzle:{
        title:String,
        question:String,
        answer:String,
    },
    creativePromt:{
        title:String,
        prompt:String,
    },
    codingSnippet:{
        language:String,
        code:String,
        task:String,
    },
    mindfulnessTask:{
        task:String,
    }
})
module.exports=mongoose.model('Spark',sparkSchema)