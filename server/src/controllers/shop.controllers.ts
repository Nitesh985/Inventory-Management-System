import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import Shop from '../models/shop.models.ts';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import { auth } from '../lib/auth.ts';

const createShop = asyncHandler(async (req: Request, res: Response) => {
  const { 
    name,
    businessType,
    useBS,
    province,
    district,
    city,
    address,
    panNumber,
    vatNumber,
    phone,
    email
  } = req.body;
  
  
  
  const emailVerified = req.user?.emailVerified
  
  if (!emailVerified){
    throw new ApiError(400, "The email of user is not verified!")
  }
  
  
  const shop = await Shop.create({
    name,
    businessType,
    useBS,
    province,
    district,
    city,
    address,
    panNumber,
    vatNumber,
    phone,
    email,
    ownerId: req.user?.id
  })
  
  
  if (!shop){
    throw new ApiError(500, "Error occured creating or updating the shop")
  }
  

  const updateUser = await auth.api.updateUser({
    body: {
      onBoardingCompleted: true,
      activeShopId:shop._id
    },
    headers: req.headers as any
  }, );
  
  if (!updateUser){
    throw new ApiError(500, "Error occured updating the user")
  }
  
  return res.status(200)
    .json(
      new ApiResponse(200, shop, "The shop was created or updated successfully!")
    )
  
});

const updateUserActiveShop = async (userId: string, activeShopId: string | null) => {
  const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
  try {
    await client.connect();
    const authDb = client.db();

    await authDb
      .collection('user')
      .updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { activeShopId: activeShopId } }
      );

    console.log('User updated with activeShopId:', activeShopId);
  } finally {
    await client.close();
  }
};

// const createShop = asyncHandler(async (req: Request, res: Response) => {
//   const { name, useBS, businessType } = req.body;
//   console.log('We are here!');

//   if (!name) throw new ApiError(400, 'Shop name is required');

//   const existing = await Shop.findOne({
//     name: name.trim(),
//   });

//   if (existing) throw new ApiError(400, 'Shop with this name already exists');

//   const ownerId = new mongoose.Types.ObjectId(req.user?.id);

//   const shop = new Shop({
//     name: name.trim(),
//     useBS: !!useBS,
//     businessType: businessType,
//     ownerId,
//   });

//   console.log(shop);

//   // Save the shop first
//   const shopSaved = await shop.save();
//   const shopId = (shopSaved._id as mongoose.Types.ObjectId).toString();

//   // Set this as the active shop (especially useful for first shop creation)
//   try {
//     await updateUserActiveShop(req.user?.id!, shopId);
//   } catch (error) {
//     console.error('Failed to update user with activeShopId:', error);
//   }

//   return res.status(201).json(new ApiResponse(201, shopSaved, 'Shop created'));
// });

const getShops = asyncHandler(async (req: Request, res: Response) => {
  const shops = await Shop.find({});
  return res.status(200).json(new ApiResponse(200, shops, 'Shops fetched'));
});

const getMyShops = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'User not authenticated');

  const shops = await Shop.find({ ownerId: new mongoose.Types.ObjectId(userId) });
  return res.status(200).json(new ApiResponse(200, shops, 'User shops fetched'));
});

const setActiveShop = asyncHandler(async (req: Request, res: Response) => {
  const { shopId } = req.body;
  const userId = req.user?.id;

  if (!userId) throw new ApiError(401, 'User not authenticated');
  if (!shopId) throw new ApiError(400, 'Shop ID is required');

  // Verify the shop exists and belongs to the user
  const shop = await Shop.findOne({
    _id: new mongoose.Types.ObjectId(shopId),
    ownerId: new mongoose.Types.ObjectId(userId),
  });

  if (!shop) throw new ApiError(404, 'Shop not found or you do not have access to it');

  // Update the user's active shop
  await updateUserActiveShop(userId, shopId);

  return res
    .status(200)
    .json(new ApiResponse(200, { activeShopId: shopId }, 'Active shop updated'));
});

const getShop = asyncHandler(async (req: Request, res: Response) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) throw new ApiError(404, 'Shop not found');
  return res.status(200).json(new ApiResponse(200, shop, 'Shop fetched'));
});

// Get the current active shop profile
const getActiveShopProfile = asyncHandler(async (req: Request, res: Response) => {
  const activeShopId = req.user?.activeShopId;
  if (!activeShopId) throw new ApiError(400, 'No active shop selected');

  const shop = await Shop.findById(activeShopId);
  if (!shop) throw new ApiError(404, 'Active shop not found');

  return res.status(200).json(new ApiResponse(200, shop, 'Active shop profile fetched'));
});

// Update the current active shop profile
const updateActiveShopProfile = asyncHandler(async (req: Request, res: Response) => {
  const activeShopId = req.user?.activeShopId;
  if (!activeShopId) throw new ApiError(400, 'No active shop selected');

  const {
    name,
    useBS,
    businessType,
    panNumber,
    vatNumber,
    currency,
    address,
    city,
    district,
    province,
    phone,
    email,
    website,
    logo,
  } = req.body;

  const updateFields: any = {};
  if (name !== undefined) updateFields.name = name;
  if (useBS !== undefined) updateFields.useBS = useBS;
  if (businessType !== undefined) updateFields.businessType = businessType;
  if (panNumber !== undefined) updateFields.panNumber = panNumber;
  if (vatNumber !== undefined) updateFields.vatNumber = vatNumber;
  if (currency !== undefined) updateFields.currency = currency;
  if (address !== undefined) updateFields.address = address;
  if (city !== undefined) updateFields.city = city;
  if (district !== undefined) updateFields.district = district;
  if (province !== undefined) updateFields.province = province;
  if (phone !== undefined) updateFields.phone = phone;
  if (email !== undefined) updateFields.email = email;
  if (website !== undefined) updateFields.website = website;
  if (logo !== undefined) updateFields.logo = logo;

  const updated = await Shop.findByIdAndUpdate(activeShopId, { $set: updateFields }, { new: true });

  if (!updated) throw new ApiError(404, 'Shop not found or could not be updated');
  return res.status(200).json(new ApiResponse(200, updated, 'Shop profile updated'));
});

const updateShop = asyncHandler(async (req: Request, res: Response) => {
  const { name, useBS } = req.body;
  const updated = await Shop.findByIdAndUpdate(
    req.params.id,
    { $set: { ...(name ? { name } : {}), ...(typeof useBS !== 'undefined' ? { useBS } : {}) } },
    { new: true }
  );
  if (!updated) throw new ApiError(404, 'Shop not found or could not be updated');
  return res.status(200).json(new ApiResponse(200, updated, 'Shop updated'));
});

const deleteShop = asyncHandler(async (req: Request, res: Response) => {
  await Shop.findByIdAndDelete(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Shop deleted'));
});

export {
  createShop,
  getShops,
  getMyShops,
  setActiveShop,
  getShop,
  getActiveShopProfile,
  updateActiveShopProfile,
  updateShop,
  deleteShop,
};
