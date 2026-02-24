import type { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import Supplier from "../models/supplier.models.ts";

// CREATE SUPPLIER
const createSupplier = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { name, phone, email, company, address, notes } = req.body;

  if (!name) {
    throw new ApiError(400, "Supplier name is required");
  }

  if (!phone && !email && !address) {
    throw new ApiError(400, "At least one of phone, email, or address is required");
  }

  // Check for duplicate email
  if (email) {
    const existingByEmail = await Supplier.findOne({
      shopId: new mongoose.Types.ObjectId(shopId),
      email: email.toLowerCase(),
      deleted: false,
    });
    if (existingByEmail) {
      throw new ApiError(400, "A supplier with that email already exists");
    }
  }

  // Check for duplicate phone
  if (phone) {
    const existingByPhone = await Supplier.findOne({
      shopId: new mongoose.Types.ObjectId(shopId),
      phone: phone,
      deleted: false,
    });
    if (existingByPhone) {
      throw new ApiError(400, "A supplier with that phone number already exists");
    }
  }

  const supplier = await Supplier.create({
    shopId: new mongoose.Types.ObjectId(shopId),
    name,
    phone: phone || "",
    email: email ? email.toLowerCase() : "",
    company: company || "",
    address: address || "",
    notes: notes || "",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, supplier, "Supplier created"));
});

// GET ALL SUPPLIERS
const getSuppliers = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;

  const suppliers = await Supplier.find({
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, suppliers, "Suppliers fetched"));
});

// GET SINGLE SUPPLIER
const getSupplier = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;

  const supplier = await Supplier.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false,
  });

  if (!supplier) throw new ApiError(404, "Supplier not found");

  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier fetched"));
});

// UPDATE SUPPLIER
const updateSupplier = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const updates = { ...req.body };
  delete updates._id;
  delete updates.shopId;

  const supplier = await Supplier.findOneAndUpdate(
    {
      _id: req.params.id,
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    },
    { $set: updates },
    { new: true }
  );

  if (!supplier) throw new ApiError(404, "Supplier not found");

  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier updated"));
});

// DELETE SUPPLIER (soft delete)
const deleteSupplier = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;

  const supplier = await Supplier.findOneAndUpdate(
    {
      _id: req.params.id,
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    },
    { $set: { deleted: true } },
    { new: true }
  );

  if (!supplier) throw new ApiError(404, "Supplier not found");

  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier deleted"));
});

export {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
