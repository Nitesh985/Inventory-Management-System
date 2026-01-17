import { asyncHandler, ApiError, ApiResponse } from '../utils/index.ts'
import type { Request, Response } from 'express'
import Category from '../models/category.models.ts'


const getAllCategories = asyncHandler(async(req:Request, res:Response)=>{
  const categories = await Category.find({})
  
  if (!categories){
    throw new ApiError(500, "Something went wrong fetching the categories!")
  }
  
  
  return res.status(200)
    .json(
      new ApiResponse(200, categories, "The categories were fetched successfully!")
    )
})


export {
  getAllCategories
}