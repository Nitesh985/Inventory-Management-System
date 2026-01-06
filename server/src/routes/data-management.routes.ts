import { Router } from "express";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";
import {
  exportData,
  createBackup,
  getBackupInfo,
  restoreBackup,
  clearData,
  getStorageInfo,
} from "../controllers/data-management.controllers.ts";

const router = Router();

// All routes require business authentication (user must have an active shop)
router.use(verifyBusinessAuth);

// Export data in various formats
router.get("/export", exportData);

// Backup operations
router.get("/backup/info", getBackupInfo);
router.post("/backup", createBackup);
router.post("/restore", restoreBackup);

// Storage management
router.get("/storage", getStorageInfo);
router.post("/clear", clearData);

export default router;
