import { Router } from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controllers.ts";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";

const router = Router();
router.use(verifyBusinessAuth);

// CREATE SUPPLIER
router.post("/", createSupplier);

// GET ALL SUPPLIERS
router.get("/", getSuppliers);

// GET SINGLE SUPPLIER
router.get("/:id", getSupplier);

// UPDATE SUPPLIER
router.put("/:id", updateSupplier);

// DELETE SUPPLIER (soft delete)
router.delete("/:id", deleteSupplier);

export default router;
