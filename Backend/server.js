const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

const AuthRoutes=require('./routes/auth');
const activityRoutes=require('./routes/activities')
const { GoogleGenAI } = require('@google/genai');
const { OpenAI } = require('openai');

app.use('/api/auth',AuthRoutes);
app.use('/api/activities',activityRoutes)

const gemini=new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const grok=new OpenAI({apiKey: process.env.XAI_API_KEY, baseURL: "https://api.x.ai/v1"});

async function callGeminiOnly(prompt) {
    try {
        const response=await gemini.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        })
        return response.text;
    } catch(geminiError) {
       console.warn("Gemini Error. Switching to fallback...",geminiError.message);
       // Check for rate limit errors
       if(geminiError.message.includes('rate limit') || geminiError.message.includes('quota') || geminiError.message.includes('429')) {
           const error = new Error("Rate limit exceeded");
           error.rateLimit = true;
           throw error;
       }
       try{
        const completion=await grok.chat.completions.create({
            model:"grok-4.5",
            messages:[{role:"user",content:prompt}],
        })
        return completion.choices[0].message.content
       } catch(grokError) {
        console.error("Grok fallback error:",grokError);
        // Check for rate limit errors
        if(grokError.message.includes('rate limit') || grokError.message.includes('quota') || grokError.message.includes('429')) {
            const error = new Error("Rate limit exceeded");
            error.rateLimit = true;
            throw error;
        }
       }
    }
}
app.post("/api/puzzle/generate",async(req,res)=>{
    try{
        const {category}=req.body;
        let specificInstructions="";
        if(category.toLowerCase().includes("pattern")) {
            specificInstructions=`
    - For "Pattern Sequence", provide a text-based description of the sequence and include 4 multiple-choice options.
    - Add a "options" key as an array of 4 strings (e.g., ["A) 12", "B) 14", "C) 16", "D) 18"]).
    - The "question" should clearly state the pattern and ask which option comes next.`;
        } else if(category.toLowerCase().includes("equation")) {
            specificInstructions=`
    - For "Equation", provide a math or symbol-based balancing puzzle where missing numbers or symbols need to be solved.
    - The "question" should clearly state the equations and ask for the missing value (e.g., "What number does ★ represent?").`;
        } else if(category.toLowerCase().includes("word ladder")) {
            specificInstructions=`
    - For "Word Ladder", provide a starting word and a target end word of the same length that can logically be bridged step-by-step changing only one letter at a time with valid English words.
    - The "question" should specify the start word, end word, and instruct the user to provide the very next valid 1-letter-change word step.`;
        }
        const prompt=`Generate a unique and accurate puzzle for the category: "${category}". Ensure it has a mathematically or logically valid solution.
    Format your response strictly as JSON with the following keys:
    - "question": The text/description of the puzzle.
    - "id": A unique identifier or key for this puzzle instance.${specificInstructions}`;
        const aiResponseText=await callGeminiOnly(prompt)
        const cleanedJson = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const puzzleData = JSON.parse(cleanedJson);
        res.json({success: true,puzzle:puzzleData})
    } catch(error) {
        if(error.rateLimit) {
            return res.status(403).json({success:false,error:"Rate limit exceeded"})
        }
        res.status(500).json({success:false,error:error.message})
    }
})
app.post("/api/puzzle/hint",async(req,res)=>{
    try {
        const {question,category}=req.body;
        const prompt=`For this ${category} puzzle: "${question}", provide a helpful, clever hint without giving away the direct answer. Keep it concise.`;
        const hint=await callGeminiOnly(prompt);
        res.json({success:true,hint})
    } catch(error) {
        if(error.rateLimit) {
            return res.status(403).json({success:false,error:"Rate limit exceeded"})
        }
        res.status(500).json({success:true,error:error.message})
    }
})
app.post("/api/puzzle/verify",async(req,res)=>{
    try {
        const {question,userAnswer,category}=req.body;
        const prompt=`You are a strict, definitive puzzle judge. Evaluate whether the user's answer is correct for the following ${category} puzzle.
    Puzzle: "${question}"
    User Answer: "${userAnswer}"
    
    Rules for evaluation:
    - "isCorrect": Set to true ONLY if the user's answer precisely solves or correctly answers the puzzle prompt. If it is wrong, incomplete, or gibberish, set it to false.
    - "feedback": If correct, state clearly that it is correct. If incorrect, state clearly that it is wrong and provide the exact correct answer. Keep it strictly to 1-2 sentences with no extra conversational follow-up questions.
    - "farewell": Leave this blank.
    Format your response strictly as JSON with these keys:
    - "isCorrect": boolean
    - "feedback": string
    - "farewell": string`;
    const aiResponseText=await callGeminiOnly(prompt);
    const cleanedJson = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const result=JSON.parse(cleanedJson);
    res.json({success:true,result})
    } catch(err) {
        if(err.rateLimit) {
            return res.status(403).json({success:false,error:"Rate limit exceeded"})
        }
        res.status(500).json({success:false,error:err.message})
    }
})
app.post("/api/curiosity/fact", async (req, res) => {
    try {
        const { domain } = req.body;
        const prompt = `Provide an interesting, lesser-known scientific or historical fact about the domain: "${domain}". 
        Give it a short title and a description. Format your text with the title on the first line, followed by a blank line, followed by the description.`;
        const rawReply = await callGeminiOnly(prompt);
        const parts = rawReply ? rawReply.split("\n\n") : [];
        const title = parts[0] ? parts[0].replace(/^(Title:|#+)\s*/i, "").trim() : `The Secret of ${domain}`;
        const promptText = (parts.slice(1).join("\n\n").trim() || rawReply || "No description available.").replace(/\*/g, "");
        res.json({
            success: true,
            quest: {
                title,
                prompt: promptText,
                type: domain
            }
        });
    } catch (error) {
        if(error.rateLimit) {
            return res.status(403).json({success:false,error:"Rate limit exceeded"})
        }
        console.error("Curiosity fact API error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post("/api/snippets/generate-question", async (req, res) => {
    try {
        const { persona } = req.body;
        let personaContext = "";
        if (persona === "non-coder") {
            personaContext = `
            - The user is a "non-coder" who wants to learn coding concepts through logic, real-world analogies, or everyday systems.
            - Do NOT use code syntax. Set "code" to null.`;
        } else {
            personaContext = `
            - The user is "familiar with coding" and can handle lightweight syntax challenges, output prediction, or simple bug-spotting.
            - Provide a short code snippet to be placed in the "code" field with clear line breaks.`;
        }
        const prompt = `Generate a unique, accurate learning challenge for a user with the persona: "${persona}".
            ${personaContext}
            Format your response strictly as JSON with the following keys:
            - "title": A short, catchy title for the challenge.
            - "prompt": The descriptive text or scenario presenting the problem (do NOT include the code here if it's a coding challenge).
            - "code": The exact code snippet with proper line breaks (string, or null if non-coder).
            - "type": A short tag indicating the challenge type (e.g., "Logical Reasoning", "Bug Spotting", "Concept Check").`;    
        const aiResponseText = await callGeminiOnly(prompt);
        const cleanedJson = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const questionData = JSON.parse(cleanedJson);
        res.json({ success: true, question: questionData });
    } catch (error) {
        if(error.rateLimit) {
            return res.status(403).json({success:false,error:"Rate limit exceeded"})
        }
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post("/api/snippets/respond",async(req,res)=>{
    try {
        const {userInput,persona,currentQuestion}=req.body;
        const prompt=`You are a precise, strict AI evaluator. Evaluate the user's answer to this challenge: "${currentQuestion || 'General discussion'}".
User's Answer: "${userInput}"
Instructions:
- If the user's answer is correct, state clearly that it is correct. 
- If the user's answer is incorrect, state clearly that it is wrong and provide the precise correct answer or concept.
- Keep your response brief (1-2 sentences). Do not continue the conversation or ask follow-up questions.`;
        const reply=await callGeminiOnly(prompt);
        res.json({success:true,reply});
    } catch(error) {
        if(error.rateLimit) {
            return res.status(403).json({success:false,error:"Rate limit exceeded"})
        }
        res.status(500).json({success:false,error:error.message});
    }
})
app.post("/api/mindfulness/generate-task",async(req,res)=>{
    try {
        const {mood}=req.body;
        if(!mood) {
            return res.status(400).json({success:false,error:"Mood is required"});
        }
        const prompt=`Generate a micro-activity tailored for someone feeling ${mood}. 
        Variety requirement: Mix it up. Sometimes you can suggest a breathing exercise or meditation, but actively include hands-on or mental tasks like physical stretching, quick workspace decluttering, rapid journaling prompts, or a short active distraction. Avoid repeating breathing exercises every single time.
        Provide a catchy title, a short description of the steps, and an estimated duration. Return the response in JSON format with keys: title, description, duration.`;
        const aiResponseText=await callGeminiOnly(prompt);
        const cleanedText = aiResponseText.replace(/```json\n?|\n?```/g, "").trim();
        const task = JSON.parse(cleanedText);
        return res.status(200).json({success:true,task});
    } catch(err) {
        if(err.rateLimit) {
            return res.status(403).json({success:false,error:"Rate limit exceeded"})
        }
        console.error("Error generating mindulness task:",err);
        return res.status(500).json({success:false,error:"Faild to generate mindfulness task"});
    }
})

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Connected to MongoDB successfully!"))
.catch((err)=>console.error("MongoDB connection error: ",err))
app.get('/api/test',(req,res)=>{
    res.json({message: "Backend is connected successfully."});
})
app.get('/', (req, res) => {
    res.json({ message: "VividBot API Server is running!" });
});
app.get('/dashboard', (req, res) => {
    res.json({ message: "VividBot API Server is running!" });
});
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Backend server running on port ${PORT}`);
})