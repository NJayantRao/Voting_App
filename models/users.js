import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ["Voter","Admin"],
        default:"Voter"
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})

userSchema.pre("save",async function (next){
    const user= this;
    //password is generated or modified only in case of any modifications in it
    if(!user.isModified("password")) return next();
    try{
        //generate salt or hashing
        const salt= await bcrypt.genSalt(10);

        //hash password
        const hashPassword= await bcrypt.hash(user.password,salt);
        user.password= hashPassword;
        next();
    }catch(err){
        next(err);
    }
})

userSchema.methods.comparePassword= async function(candidatePassword) {
    try {
        const isMatch= bcrypt.compare(candidatePassword,this.password);
        return isMatch
    } catch (error) {
        throw error;
    }
}

const User= mongoose.model("user",userSchema);

export {User}