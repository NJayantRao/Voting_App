import express from "express"
const router= express.Router();
const candidateRouter= router
import { Candidate } from "./../models/candidate.js"
import { User } from "./../models/users.js"
import {jwtAuthMiddleware,generateToken} from "./../jwt.js";

const checkAdmin= async (userID)=>{
  try{
    const user= await User.findById(userID)
    return user.role === "Admin"
  }catch(err){
    return false
  }
}

router.post("/",jwtAuthMiddleware,async (req,res)=>{
    try{
    if(! await (checkAdmin(req.user.id)))
        return res.status(401).send("Only Admin can access")
    const data= req.body
    const newCandidate= new Candidate(data);
    const response= await newCandidate.save();
    console.log("Data saved successfully...\n")
    
    res.json({response:response}).status(200)

    }
    catch(error){
      console.log("The error is ",error)
      res.send("internal server error").status(500)
    }
    })


//Profile Route

// router.get("/profile",jwtAuthMiddleware,async (req,res)=>{
//   try {
//     if(!(checkAdmin(req.user.id)))
//         return res.status(401).send("Only Admin can access")
//     const userData= req.user

//     console.log("User Data is:",userData);
    
//     const userID= userData.id

//     const user= await Person.findById(userID);

//     res.status(200).json(user)
    
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error")
    
//   }

//})

//Profile password route

router.put("/:candidateID",jwtAuthMiddleware,async (req,res)=>{
    try{
        if(!(checkAdmin(req.user.id)))
          return res.status(401).send("Only Admin can access")
        const candidateID= req.params.candidateID;
        const updatedCandidate= req.body
        const response= await Candidate.findByIdAndUpdate(candidateID,updatedCandidate,{
          new: true,
          runValidators: true
        })

        if(!response){
          return res.status(404).send("Candidate Data not found...")
        }
        console.log("Candidate Data updated...");
        res.send(response).status(200);
        }catch(error){
        console.log("The error is ",error)
        res.send("internal server error").status(500)
    }
})

//Delete Candidate

router.delete("/:candidateID",jwtAuthMiddleware,async (req,res)=>{
    try{
        if(!(checkAdmin(req.user.id)))
          return res.status(401).send("Only Admin can access")
        const candidateID= req.params.candidateID
        const response= await Candidate.findByIdAndDelete(candidateID)

        if(!response){
          return res.status(404).send("Candidate Data not found...")
        }
        console.log("Candidate Deleted...");
        res.send(response).status(200);
        }catch(error){
        console.log("The error is ",error)
        res.send("internal server error").status(500)
    }
})


export{candidateRouter}