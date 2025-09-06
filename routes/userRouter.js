import express from "express"
const router= express.Router();
const userRouter= router
import { User } from "./../models/users.js"
import {jwtAuthMiddleware,generateToken} from "./../jwt.js";

router.post("/signup",async (req,res)=>{
    try{
    const data= req.body
    const newUser= new User(data);
    const response= await newUser.save();
    console.log("Data saved successfully...\n")

    const payload={
      id: response.id
    }

    console.log(JSON.stringify(payload));
    
    
    const token= generateToken(payload)
    console.log("The token is:",token);
    
    res.json({response:response,token:token}).status(200)

    }
    catch(error){
      console.log("The error is ",error)
      res.send("internal server error").status(500)
    }
    })

//login Route
router.get("/login",async(req,res)=>{
  try {
    //Extract the aadharCardNumber and password from req body

    const {aadharCardNumber,password}= req.body

    //Find username in the database
    const user= await User.findOne({aadharCardNumber: aadharCardNumber})

    //if user doesn't exist or password doesn't match

    if(!user || !(await user.comparePassword(password)))
        return res.status(401).json({error:"Invalid Username or Password"})

    //generate token
    const payload={
      id: user.id,
    }

    const token= generateToken(payload);

    console.log(`the token is ${token}`);
    return res.json({token})
    

  } catch (error) {
    res.status(500).send("Internal Server Error")
    console.log(error);
    
  }
})

//Profile Route

router.get("/profile",jwtAuthMiddleware,async (req,res)=>{
  try {
    const userData= req.user

    console.log("User Data is:",userData);
    
    const userID= userData.id

    const user= await User.findById(userID);

    res.status(200).json(user)
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error")
    
  }

})

//Profile password route
//not
router.put("/profile/password",jwtAuthMiddleware,async (req,res)=>{
    try{
        const userId= req.user.id; //extract id from token
        const {currentPassword,newPassword}= req.body; // extract the current and new passwords from the body

        const user= await User.findById(userId);

        //if user doesn't exist or password doesn't match
    if(!(await user.comparePassword(currentPassword)))
        return res.status(401).json({error:"Invalid Password"})

    user.password=newPassword;
    await user.save();

        
        console.log("Password updated...");
        res.json({message:"password updated"}).status(200);
        }catch(error){
        console.log("The error is ",error)
        res.send("internal server error").status(500)
    }
})


export{userRouter}