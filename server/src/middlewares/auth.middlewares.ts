import { ApiError } from "../utils/ApiError.ts"
import { asyncHandler } from "../utils/asyncHandler.ts"
import type { NextFunction, Request, Response } from 'express'
import {auth} from "../lib/auth.ts"
import Shop from "../models/shop.models.ts"



const verifyUserAuth = asyncHandler(async(req:Request, res:Response, next:NextFunction)=>{
  const session = await auth.api.getSession({
    headers: req.headers
  })

  console.log(session)
  
  if (!session){
    throw new ApiError(401, "Unauthorized access!")
  }

  req.user = session.user
  
  next()
})

const verifyBusinessAuth = asyncHandler(async(req:Request, res:Response, next:NextFunction)=>{
  const session = await auth.api.getSession({
    headers: req.headers
  })
  
  if (!session){
    throw new ApiError(401, "Unauthorized access!")
  }

  // TODO: Remove this temp injection once proper shop selection is implemented
  // Temporarily inject first shop's id from database for testing
  const shop = await Shop.findOne()
  if (shop) {
    // Update shop's ownerId to current user if not already set
    if (!shop.ownerId || shop.ownerId.toString() !== session.user.id) {
      shop.ownerId = session.user.id as any
      await shop.save()
    }
    session.user.activeShopId = shop._id.toString()
  }

  if (!session.user.activeShopId){
    throw new ApiError(403, "Forbidden! No active shop selected. Please select a shop first.")
  }


  req.user = session.user
  console.log(req.user)
  
  next()
})

export { verifyUserAuth, verifyBusinessAuth }
