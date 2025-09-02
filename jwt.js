import jwt from "jsonwebtoken"

const jwtAuthMiddleware= (req,res,next)=>{

    //Check whether request header has authorization or not
    const authorization= req.headers.authorization 
    if(!authorization) return res.status(401).json({error:"Token not found"})

    //Extract token from request header
    const token= req.headers.authorization.split(" ")[1];

    if(!token) return res.status(401).json({error:"Unauthorized"});

    try{
        //Verify JWT token
       const decoded= jwt.verify(token,process.env.JWT_SECRET);
       req.user= decoded
       next();
    }catch(err){
        console.log(err);
        res.status(401).send("Invalid Token")
    }
}

//Function to generate token
const generateToken= (userData)=>{
    //generate jwt using user data
    return jwt.sign(userData,process.env.JWT_SECRET)
}

export {jwtAuthMiddleware,generateToken}