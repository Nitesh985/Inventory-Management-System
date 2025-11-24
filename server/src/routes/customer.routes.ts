import { Router } from 'express'
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOutstanding,
} from '../controllers/customer.controllers.ts'

const router = Router()

// CREATE CUSTOMER
router.post('/', createCustomer)

// GET ALL CUSTOMERS
router.get('/', getCustomers)

// GET SINGLE CUSTOMER
router.get('/:id', getCustomer)

// UPDATE CUSTOMER
router.put('/:id', updateCustomer)

// DELETE CUSTOMER (soft delete)
router.delete('/:id', deleteCustomer)

// GET CUSTOMER OUTSTANDING
router.get('/outstanding/:shopId/:customerId', getCustomerOutstanding)

export default router
