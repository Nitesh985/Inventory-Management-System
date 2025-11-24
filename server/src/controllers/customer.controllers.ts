import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import Customer from '../models/customer.models.ts'
import Sales from '../models/sales.models.ts'

const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { shopId, clientId, name, phone, address } = req.body

  if (!shopId || !clientId || !name) {
    throw new ApiError(400, 'shopId, clientId and name are required')
  }

  // prevent duplicates by phone within same shop+client
  if (phone) {
    const existing = await Customer.findOne({ shopId, clientId, phone })
    if (existing) throw new ApiError(400, 'Customer with this phone already exists')
  }

  const customer = await Customer.create({
    shopId,
    clientId,
    name,
    phone: phone || '',
    address: address || '',
    outstandingBalance: 0,
    notes: '',
    deleted: false
  })

  return res.status(201).json(new ApiResponse(201, customer, "Customer created"))
})

const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { shopId, clientId } = req.query
  const filter: any = { deleted: false }
  if (shopId) filter.shopId = shopId
  if (clientId) filter.clientId = clientId
  const customers = await Customer.find(filter)
  return res.status(200).json(new ApiResponse(200, customers, 'Customers fetched'))
})

const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer || customer.deleted) throw new ApiError(404, 'Customer not found')
  return res.status(200).json(new ApiResponse(200, customer, 'Customer fetched'))
})

const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const updates = { ...req.body }
  delete updates._id
  const customer = await Customer.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
  if (!customer) throw new ApiError(404, 'Customer not found')
  return res.status(200).json(new ApiResponse(200, customer, 'Customer updated'))
})

const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  // soft delete
  const customer = await Customer.findByIdAndUpdate(req.params.id, { $set: { deleted: true } }, { new: true })
  if (!customer) throw new ApiError(404, 'Customer not found')
  return res.status(200).json(new ApiResponse(200, customer, 'Customer deleted'))
})


const getCustomerOutstanding = asyncHandler(
  async (req: Request, res: Response) => {
    const { customerId, shopId } = req.params;

    if (!customerId || !shopId) {
      throw new ApiError(400, "customerId and shopId are required");
    }

    const data = await Sales.aggregate([
      {
        $match: {
          customerId,
          shopId,
          deleted: { $ne: true } // if your Sales has deleted
        }
      },

      // Calculate unpaidAmount = totalAmount - paidAmount
      {
        $addFields: {
          unpaidAmount: { $subtract: ["$totalAmount", "$paidAmount"] }
        }
      },

      // Expand items array
      { $unwind: "$items" },

      {
        $project: {
          _id: 0,
          invoiceNo: 1,
          createdAt: 1,
          customerId: 1,
          productId: "$items.productId",
          productName: "$items.productName",
          quantity: "$items.quantity",
          unitPrice: "$items.unitPrice",
          totalPrice: "$items.totalPrice",
          unpaidAmount: 1
        }
      },

      // Now group everything together
      {
        $group: {
          _id: null,
          itemsTaken: { $push: "$$ROOT" },
          totalOutstanding: { $sum: "$unpaidAmount" }
        }
      }
    ]);

    if (!data || data.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, { itemsTaken: [], totalOutstanding: 0 }, "No sales found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, data[0], "Customer outstanding fetched successfully"));
  }
);


export {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerOutstanding,
}