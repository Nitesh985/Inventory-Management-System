import { Router } from 'express'
import { verifyBusinessAuth } from '../middlewares/auth.middlewares.ts'
import {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  upsertBudget
} from '../controllers/budget.controllers.ts'

const router = Router()

// All routes require authentication
router.use(verifyBusinessAuth)

router.post('/', createBudget)
router.get('/', getBudgets)
router.get('/:id', getBudget)
router.put('/:id', updateBudget)
router.delete('/:id', deleteBudget)
router.post('/upsert', upsertBudget)

export default router
