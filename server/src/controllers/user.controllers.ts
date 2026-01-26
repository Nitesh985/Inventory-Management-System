import type { Request, Response } from 'express'
import User from '../models/user.models.ts'
import Shop from '../models/shop.models.ts'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import mongoose from 'mongoose'
import crypto from "crypto";
import { auth } from '../lib/auth.ts'
import { sendEmail } from '../helpers/sendEmail.ts'
import { EmailOtp } from '../models/email-otp.models.ts'


const EMAIL_CODE_TTL_MS = 1 * 60 * 1000; // 1 minute
const MAX_OTP_ATTEMPTS = 5

function createCryptoHash(code:string){
  return crypto.createHmac("sha256", process.env.OTP_SECRET!)
    .update(code)
    .digest("hex")
}

export function generateEmailCode() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedCode = createCryptoHash(code)
  

  const expiresAt = new Date(Date.now() + EMAIL_CODE_TTL_MS);

  return {
    code,       
    hashedCode, 
    expiresAt, 
  };
}


const sendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
  const { code, hashedCode, expiresAt } = generateEmailCode()
  console.log("OKay on the email verification")
  
  const saveOtp = await EmailOtp.findOneAndUpdate({
    email:req.user!.email
  },
  {
    hashedCode,
    expiresAt
  }, {
    upsert: true,
    new: true
  })
  
  if (!saveOtp){
    throw new ApiError(500, "Error saving the email otp")
  }
  
  
  await sendEmail({
    to: req.user?.email || "",
    subject: "Your verification code",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:6px;
        margin:16px 0;
      ">
        ${code}
      </div>
      <p>This code expires in 2 minutes.</p>
    `,
    text: `Your verification code is ${code}. It expires in a minutes.`,
  });
  
  console.log("Sent the email")
  
  return res.status(200)
    .json(
      new ApiResponse(200, {}, "The verification code was successfully made")
    )  
})

const checkVerificationCode = asyncHandler (async (req: Request, res: Response)=>{
  const { inputCode } = req.body
  
  const findOtp = await EmailOtp.findOne({
    email:req.user?.email
  })
  
  if (!findOtp){
    throw new ApiError(400, "Not so vaid otp!")
  }
  
   
  if (findOtp.expiresAt && Date.now() > findOtp.expiresAt.getTime()){
    throw new ApiError(400, "The verification code is expired!")
  }
  
  if (findOtp.attempts >= MAX_OTP_ATTEMPTS) {
    await EmailOtp.deleteOne({ _id: findOtp._id });
    throw new Error("Too many attempts. Code expired.");
  }
  
  const inputHash = createCryptoHash(inputCode)
  
  if (inputHash != findOtp.hashedCode){
    findOtp.attempts += 1
    findOtp.save()
    
    throw new ApiError(400, "The otp is invalid!")
  }
  
  // Update user's emailVerified status in better-auth
  await auth.api.updateUser({
    body: {
      emailVerified: true
    },
    headers: req.headers as any
  })
  
  // Clean up the OTP record after successful verification
  await EmailOtp.deleteOne({ _id: findOtp._id })
   
  return res.status(200)
    .json(
      new ApiResponse(200, {}, "The otp was successfully verified")
    )
  
})



const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, fullName, contactNo } = req.body;

    const user = await User.create({
      email,
      fullName,
      contactNo
    });
    
    res.status(201).json({ user});
  } catch (error) {
    res.status(400).json({ error });
  }
};


// Get current user profile with active shop phone number using aggregation
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const activeShopId = req.user?.activeShopId
  
  if (!userId) {
    throw new ApiError(401, 'Unauthorized')
  }

  // Use aggregation to fetch user with shop phone in one query
  const result = await Shop.aggregate([
    // Match the active shop
    {
      $match: {
        _id: new mongoose.Types.ObjectId(activeShopId),
        ownerId: new mongoose.Types.ObjectId(userId)
      }
    },
    // Project only the fields we need
    {
      $project: {
        _id: 0,
        phone: 1,
        shopName: '$name',
        shopEmail: '$email'
      }
    }
  ])

  const shopData = result[0] || null

  return res.status(200).json(new ApiResponse(200, {
    user: {
      id: req.user?.id,
      name: req.user?.name,
      email: req.user?.email,
      image: req.user?.image,
      createdAt: req.user?.createdAt,
    },
    activeShop: shopData
  }, 'User profile fetched successfully'))
})


// Update user profile (name only - email changes should go through better-auth)
const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  
  if (!userId) {
    throw new ApiError(401, 'Unauthorized')
  }

  // Note: better-auth handles the actual user update
  // This endpoint can be used for additional user data stored in our User model
  const { contactNo } = req.body

  const updateFields: any = {}
  if (contactNo !== undefined) updateFields.contactNo = contactNo

  // Update our local User model if it exists
  const user = await User.findOneAndUpdate(
    { email: req.user?.email },
    { $set: updateFields },
    { new: true, upsert: true }
  )

  return res.status(200).json(new ApiResponse(200, user, 'User profile updated'))
})


// Update tour completion status
const updateTourStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  
  if (!userId) {
    throw new ApiError(401, 'Unauthorized')
  }

  const { hasCompletedTour } = req.body

  // Update our local User model
  const user = await User.findOneAndUpdate(
    { email: req.user?.email },
    { $set: { hasCompletedTour } },
    { new: true, upsert: true }
  )

  return res.status(200).json(new ApiResponse(200, { hasCompletedTour: user?.hasCompletedTour }, 'Tour status updated'))
})


export {
  sendVerificationCode,
  checkVerificationCode,
  updateTourStatus
}