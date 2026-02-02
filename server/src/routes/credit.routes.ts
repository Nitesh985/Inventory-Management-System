import { Router } from "express";
import { 
  createPayment,
  getCustomersWithBalance,
  getCustomerCreditHistory,
  getCustomersCreditSummary 
} from "../controllers/credit.controllers.ts";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";

const router = Router();
router.use(verifyBusinessAuth);

// Payment and customer balance operations
router.post("/payment", createPayment);
router.get("/summary", getCustomersCreditSummary);
router.get("/customers-with-balance", getCustomersWithBalance);
router.get("/history/:customerId", getCustomerCreditHistory);

export default router;
