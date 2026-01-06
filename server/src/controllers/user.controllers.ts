import type { Request, Response } from 'express'
import User from '../models/user.models.ts'
import Shop from '../models/shop.models.ts'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import mongoose from 'mongoose'

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


export {
  registerUser,
  getUserProfile,
  updateUserProfile,
}