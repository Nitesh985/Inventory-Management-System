import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import Product from '../models/product.models.ts';
import mongoose from 'mongoose';
import { auth } from '../lib/auth.ts';


const getProductsRanking = asyncHandler(async (req: Request, res:Response)=>{
  
})


export {
  getProductsRanking
}