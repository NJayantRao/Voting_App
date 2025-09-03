import express from "express"
const router= express.Router();
const candidateRouter= router
import { Candidate } from "./../models/candidate.js"
import { User } from "./../models/users.js"
import {jwtAuthMiddleware,generateToken} from "./../jwt.js";
//import passport from "passport";

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

//Voting phase begins

router.post("/vote/:candidateID",jwtAuthMiddleware,async (req,res)=>{

  const candidateId= req.params.candidateID
  const userId= req.user.id

  try {
    //Find Candidate through candidateId

    const candidate= await Candidate.findById(candidateId)
    if(!candidate)
    {
      return res.status(404).send("Candidate not found")
    }

    //Find user through userId

    const user= await User.findById(userId)
    if(!user)
    {
      return res.status(404).send("User not found")
    }

    //If user has already voted
    if(user.isVoted){
      return res.status(400).send("You have already voted")
    }

    //For admin restriction
    if(user.role === "Admin"){
      return res.status(403).send("Admin Can't Vote")
    }

    //Update User info. in Candidate schema
    candidate.votes.push({user:userId})
    candidate.voteCount++;
    await candidate.save();

    //Update User info.
    user.isVoted= true;
    await user.save();

    res.status(200).send("Voted successfully")

  } catch (error) {
      console.log("The error is ",error)
      res.send("internal server error").status(500)
  }
})

//Vote counting

router.get("/vote/count", async (req,res)=>{
  try {
    //Get candidate info. in sorted order
    const candidate= await Candidate.find().sort({voteCount:"desc"})

    //candidate should only return user name and Votecount
    const voteRecord= candidate.map((data=>{
      return{ party: data.party,
             count: data.voteCount
      }
    }))
    res.status(200).json({voteRecord})
  } catch (error) {
    console.log("The error is ",error)
    res.send("internal server error").status(500)
  }
})


export{candidateRouter}