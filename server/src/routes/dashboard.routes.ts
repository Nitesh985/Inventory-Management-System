import { Router } from "express";
import { getDashboard, getDashboardMetrics, getChartData } from "../controllers/dashboard.controllers.ts";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";


const router = Router();
router.use(verifyBusinessAuth)


// GET dashboard overview
router.get("/", getDashboard);

// GET dashboard metrics (revenue, expenses, profit, etc.)
router.get("/metrics", getDashboardMetrics);

// GET chart data for business performance visualization
router.get("/chart", getChartData);


export default router;
