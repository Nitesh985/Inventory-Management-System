import { Router } from "express";
import { 
  createCredit,
  createPayment,
  getCredits,
  getCreditById,
  updateCredit,
  deleteCredit,
  getCustomersWithBalance,
  getCustomerCreditHistory,
  getCustomersCreditSummary 
} from "../controllers/credit.controllers.ts";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";

const router = Router();
router.use(verifyBusinessAuth);

// Credit CRUD
router.post("/", createCredit);
router.post("/payment", createPayment);
router.get("/", getCredits);
router.get("/summary", getCustomersCreditSummary);
router.get("/customers-with-balance", getCustomersWithBalance);
router.get("/history/:customerId", getCustomerCreditHistory);
router.get("/:id", getCreditById);
router.put("/:id", updateCredit);
router.delete("/:id", deleteCredit);

export default router;
