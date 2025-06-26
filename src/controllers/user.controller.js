import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Tokens")
    }
}


const registerUser = asyncHandler(async (req,res)=>{
        //get user details from the frontend
        //validation
        //check if the user already existed:username,email
        //check for avatar,image
        //upload them to cloudinary,avatar
        //create user object - create entry in db
        //remove password and refresh token field from the response
        //check for user creation
        // return response

        const {fullname,email,username,password} = req.body

        if(
            [fullname,email,username,password].some((field)=> field?.trim() === "")
        ){
            throw new ApiError(400,"All fields are required");
        }

        const isExisted = await User.findOne({
            $or:[{ username },{ email }]
        })

        if(isExisted){
            console.log(isExisted._id);
            throw new ApiError(409,`User already exists with ${isExisted.username === username ? 'username' : 'email'}`)
        }

        let avatarLocalPath;
        let coverImageLocalPath;
        if(req.files &&  Array.isArray(req.files.coverImage) && req.files.avatar.length > 0){
            avatarLocalPath = req.files.avatar[0].path;
        }
        if(req.files &&  Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImageLocalPath = req.files.coverImage[0].path;
        }
        // if(!avatarLocalPath){
        //     throw new ApiError(400,"Avatar file is required");
        // }
        // if(!coverImageLocalPath){
        //     throw new ApiError(400,"coverImage file is required")
        // }
        console.log(req.files);
        
        // const avatar = await uploadOnCloudinary(avatarLocalPath)
        // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        // if(!avatar) {
        //     throw new ApiError(400,"Avatar file is required");

        // }
        
        
        const user = await User.create({
            fullname,
       
            email,
            password,
            username:username.toLowerCase()
        })

        const createUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createUser){
            throw new ApiError(500,"something went wrong while registerin the user");
        }
        return res.status(201).json({
            data: new ApiResponse(200, createUser, "user Registered successfully")
        })


})


const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if(!email){
        throw new ApiError(400,"email is required");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user Credentials");
    }

    const {accessToken,refreshToken} = await generateTokens(user._id);

    const logedinUser = await User.findById(user._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                user:logedinUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged Out")
    )

})

export {registerUser,loginUser,logoutUser};