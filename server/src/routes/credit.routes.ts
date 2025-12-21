import { Router } from "express";
import { getCustomersCreditSummary } from "../controllers/credit.controllers.ts";
import { mockupData } from "../middlewares/mockup.middlewares.ts";

const router = Router();
router.use(mockupData);

// GET ALL CUSTOMERS
router.get("/", getCustomersCreditSummary);



export default router;
