import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import mongoose from 'mongoose'
import Sales from '../models/sales.models.ts'
import Product from '../models/product.models.ts'
import Inventory from '../models/inventory.models.ts'
import Customer from '../models/customer.models.ts'

type SaleItemInput = {
  productId: string
  productName?: string
  quantity: number
  unitPrice?: number
  totalPrice?: number
}

export const createSale = asyncHandler(async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  try {
    const { shopId, clientId, customerId, invoiceNo, items, paidAmount = 0, discount = 0, notes = '' } = req.body

    if (!shopId || !clientId || !items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'shopId, clientId and items are required')
    }

    // transaction
    let createdSale: any = null
    await session.withTransaction(async () => {
      // Validate customer if provided
      let customer = null
      if (customerId) {
        customer = await Customer.findById(customerId).session(session)
        if (!customer) throw new ApiError(400, 'Customer not found')
      }

      // Build and validate items, check inventory and perform reserved-first deduction
      const processedItems: any[] = []
      let totalAmount = 0

      for (const it of items as SaleItemInput[]) {
        const { productId, quantity } = it
        if (!productId || typeof quantity !== 'number' || quantity <= 0) {
          throw new ApiError(400, 'Each sale item must have productId and positive quantity')
        }

        const product = await Product.findById(productId).session(session)
        if (!product) throw new ApiError(400, `Product ${productId} not found`)

        const inventory = await Inventory.findOne({ shopId, productId }).session(session)
        if (!inventory) throw new ApiError(400, `Inventory record not found for product ${productId} in this shop`)

        const available = (inventory.reserved ?? 0) + (inventory.quantity ?? 0)
        if (available < quantity) {
          throw new ApiError(400, `Insufficient stock for product ${product.name || productId}`)
        }

        // Deduct reserved first
        let remainingToDeduct = quantity
        const inventoryUpdates: any = {}

        if ((inventory.reserved ?? 0) > 0) {
          const fromReserved = Math.min(inventory.reserved!, remainingToDeduct)
          inventoryUpdates.reserved = (inventory.reserved ?? 0) - fromReserved
          remainingToDeduct -= fromReserved
        }

        if (remainingToDeduct > 0) {
          inventoryUpdates.quantity = (inventory.quantity ?? 0) - remainingToDeduct
        }

        // Apply updates to inventory (atomic via session)
        await Inventory.findByIdAndUpdate(inventory._id, { $set: inventoryUpdates }, { session })

        // Determine unitPrice and totalPrice
        const unitPrice = typeof it.unitPrice === 'number' ? it.unitPrice : product.price ?? 0
        const totalPrice = (typeof it.totalPrice === 'number') ? it.totalPrice : unitPrice * quantity

        processedItems.push({
          productId,
          productName: product.name,
          quantity,
          unitPrice,
          totalPrice
        })

        totalAmount += totalPrice
      } // end items loop

      // Apply discount
      totalAmount = totalAmount - (discount ?? 0)
      if (totalAmount < 0) totalAmount = 0

      // Create sale
      const saleDoc = {
        shopId,
        clientId,
        customerId: customerId || null,
        invoiceNo: invoiceNo || '',
        items: processedItems,
        totalAmount,
        paidAmount,
        discount,
        notes
      }

      createdSale = await Sales.create([saleDoc], { session })
      createdSale = createdSale[0]

      // Update customer outstandingBalance
      if (customerId) {
        const owed = totalAmount - (paidAmount ?? 0)
        if (owed > 0) {
          await Customer.findByIdAndUpdate(customerId, { $inc: { outstandingBalance: owed } }, { session })
        }
      }
    }) // end transaction

    session.endSession()
    return res.status(201).json(new ApiResponse(201, createdSale, 'Sale created'))
  } catch (err: any) {
    session.endSession()
    throw err
  }
})

export const getSales = asyncHandler(async (req: Request, res: Response) => {
  const { shopId } = req.query
  const filter: any = {}
  if (shopId) filter.shopId = shopId
  const sales = await Sales.find(filter)
  return res.status(200).json(new ApiResponse(200, sales, 'Sales fetched'))
})

export const getSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await Sales.findById(req.params.id)
  if (!sale) throw new ApiError(404, 'Sale not found')
  return res.status(200).json(new ApiResponse(200, sale, 'Sale fetched'))
})

// NOTE: update / delete sales are tricky because inventory adjustments must be reversed.
// Below is a simple update that does NOT reverse inventory changes. For safety, implement reversal logic when needed.
export const updateSale = asyncHandler(async (req: Request, res: Response) => {
  const updates = { ...req.body }
  delete updates._id
  const sale = await Sales.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
  if (!sale) throw new ApiError(404, 'Sale not found')
  return res.status(200).json(new ApiResponse(200, sale, 'Sale updated'))
})

export const deleteSale = asyncHandler(async (req: Request, res: Response) => {
  // WARNING: deleting a sale should ideally restore inventory + adjust customer balance.
  await Sales.findByIdAndDelete(req.params.id)
  return res.status(200).json(new ApiResponse(200, {}, 'Sale deleted (note: inventory/customer not restored)'))
})
