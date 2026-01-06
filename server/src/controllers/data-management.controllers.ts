import type { Request, Response } from "express";
import Sales from "../models/sales.models.ts";
import Expense from "../models/expense.models.ts";
import Inventory from "../models/inventory.models.ts";
import Customer from "../models/customer.models.ts";
import Product from "../models/product.models.ts";
import Shop from "../models/shop.models.ts";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// Helper to get shop ID from request (already validated by middleware)
const getShopId = (req: Request): string | null => {
  return (req as any).user?.activeShopId || null;
};

// Export Data Controller
export const exportData = async (req: Request, res: Response) => {
  try {
    const { format, dataType, includeDeleted, includeMetadata } = req.query;
    const shopId = getShopId(req);

    if (!shopId) {
      return res.status(401).json({ success: false, message: "No active shop selected" });
    }

    let data: any[] = [];
    let filename = "";

    // Fetch data based on type
    switch (dataType) {
      case "sales":
        data = await Sales.find({ shopId }).populate("customerId", "name phone").lean();
        filename = `sales_export_${Date.now()}`;
        break;
      case "expenses":
        data = await Expense.find({ shopId }).lean();
        filename = `expenses_export_${Date.now()}`;
        break;
      case "inventory":
        data = await Inventory.find({ shopId }).populate("productId", "name sku").lean();
        filename = `inventory_export_${Date.now()}`;
        break;
      case "customers":
        data = await Customer.find({ shopId }).lean();
        filename = `customers_export_${Date.now()}`;
        break;
      case "all":
      default:
        const [sales, expenses, inventory, customers, products] = await Promise.all([
          Sales.find({ shopId }).populate("customerId", "name phone").lean(),
          Expense.find({ shopId }).lean(),
          Inventory.find({ shopId }).populate("productId", "name sku").lean(),
          Customer.find({ shopId }).lean(),
          Product.find({ shopId }).lean(),
        ]);
        data = {
          sales,
          expenses,
          inventory,
          customers,
          products,
        } as any;
        filename = `all_data_export_${Date.now()}`;
        break;
    }

    // Remove metadata if not requested
    if (!includeMetadata && Array.isArray(data)) {
      data = data.map((item: any) => {
        const { __v, createdAt, updatedAt, ...rest } = item;
        return rest;
      });
    }

    // Generate export based on format
    switch (format) {
      case "csv":
        return exportAsCSV(res, data, filename, dataType as string);
      case "excel":
        return exportAsExcel(res, data, filename, dataType as string);
      case "json":
        return exportAsJSON(res, data, filename);
      case "pdf":
        return exportAsPDF(res, data, filename, dataType as string);
      default:
        return res.status(400).json({ success: false, message: "Invalid export format" });
    }
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ success: false, message: "Failed to export data" });
  }
};

// CSV Export
const exportAsCSV = (res: Response, data: any, filename: string, dataType: string) => {
  try {
    let csvData: string;
    
    if (dataType === "all" && !Array.isArray(data)) {
      // For 'all' data, we'll export as multiple sections
      const sections: string[] = [];
      for (const [key, values] of Object.entries(data)) {
        if (Array.isArray(values) && values.length > 0) {
          const parser = new Parser();
          sections.push(`--- ${key.toUpperCase()} ---\n${parser.parse(values)}`);
        }
      }
      csvData = sections.join("\n\n");
    } else if (Array.isArray(data) && data.length > 0) {
      const parser = new Parser();
      csvData = parser.parse(data);
    } else {
      csvData = "No data available";
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
    return res.send(csvData);
  } catch (error) {
    console.error("CSV export error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate CSV" });
  }
};

// Excel Export
const exportAsExcel = async (res: Response, data: any, filename: string, dataType: string) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Inventory Management System";
    workbook.created = new Date();

    if (dataType === "all" && !Array.isArray(data)) {
      // Create a worksheet for each data type
      for (const [key, values] of Object.entries(data)) {
        if (Array.isArray(values) && values.length > 0) {
          const worksheet = workbook.addWorksheet(key.charAt(0).toUpperCase() + key.slice(1));
          const columns = Object.keys(values[0]).map((key) => ({
            header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
            key: key,
            width: 20,
          }));
          worksheet.columns = columns;
          worksheet.addRows(values);
          
          // Style header row
          worksheet.getRow(1).font = { bold: true };
          worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
          };
        }
      }
    } else if (Array.isArray(data) && data.length > 0) {
      const worksheet = workbook.addWorksheet(dataType || "Data");
      const columns = Object.keys(data[0]).map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        key: key,
        width: 20,
      }));
      worksheet.columns = columns;
      worksheet.addRows(data);
      
      // Style header row
      worksheet.getRow(1).font = { bold: true };
    } else {
      const worksheet = workbook.addWorksheet("Data");
      worksheet.addRow(["No data available"]);
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
    
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Excel export error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate Excel file" });
  }
};

// JSON Export
const exportAsJSON = (res: Response, data: any, filename: string) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}.json`);
  return res.json({ exportedAt: new Date().toISOString(), data });
};

// PDF Export
const exportAsPDF = (res: Response, data: any, filename: string, dataType: string) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);
    
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Data Export Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Export Date: ${new Date().toLocaleString()}`, { align: "center" });
    doc.fontSize(12).text(`Data Type: ${dataType || "All"}`, { align: "center" });
    doc.moveDown(2);

    const printTable = (title: string, items: any[]) => {
      doc.fontSize(14).text(title, { underline: true });
      doc.moveDown(0.5);
      
      if (items.length === 0) {
        doc.fontSize(10).text("No records found");
        doc.moveDown();
        return;
      }

      doc.fontSize(10);
      items.slice(0, 50).forEach((item, index) => {
        const summary = Object.entries(item)
          .slice(0, 5)
          .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v).slice(0, 30) : String(v).slice(0, 30)}`)
          .join(" | ");
        doc.text(`${index + 1}. ${summary}`, { width: 500 });
      });
      
      if (items.length > 50) {
        doc.text(`... and ${items.length - 50} more records`);
      }
      doc.moveDown();
    };

    if (dataType === "all" && !Array.isArray(data)) {
      for (const [key, values] of Object.entries(data)) {
        if (Array.isArray(values)) {
          printTable(key.charAt(0).toUpperCase() + key.slice(1), values);
        }
      }
    } else if (Array.isArray(data)) {
      printTable(dataType || "Data", data);
    }

    doc.end();
  } catch (error) {
    console.error("PDF export error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate PDF" });
  }
};

// Create Backup
export const createBackup = async (req: Request, res: Response) => {
  try {
    const shopId = getShopId(req);
    const { includeMedia, encrypt } = req.body;

    if (!shopId) {
      return res.status(401).json({ success: false, message: "No active shop selected" });
    }

    // Fetch all data for backup
    const [sales, expenses, inventory, customers, products, shop] = await Promise.all([
      Sales.find({ shopId }).lean(),
      Expense.find({ shopId }).lean(),
      Inventory.find({ shopId }).lean(),
      Customer.find({ shopId }).lean(),
      Product.find({ shopId }).lean(),
      Shop.findById(shopId).lean(),
    ]);

    const backupData = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      shopId,
      shop,
      data: {
        sales,
        expenses,
        inventory,
        customers,
        products,
      },
      metadata: {
        totalRecords: sales.length + expenses.length + inventory.length + customers.length + products.length,
        salesCount: sales.length,
        expensesCount: expenses.length,
        inventoryCount: inventory.length,
        customersCount: customers.length,
        productsCount: products.length,
      },
    };

    const filename = `backup_${shopId}_${Date.now()}.json`;
    
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    
    return res.json(backupData);
  } catch (error) {
    console.error("Backup error:", error);
    return res.status(500).json({ success: false, message: "Failed to create backup" });
  }
};

// Get Backup Status / Info
export const getBackupInfo = async (req: Request, res: Response) => {
  try {
    const shopId = getShopId(req);

    if (!shopId) {
      return res.status(401).json({ success: false, message: "No active shop selected" });
    }

    // Get counts for storage estimation
    const [salesCount, expensesCount, inventoryCount, customersCount, productsCount] = await Promise.all([
      Sales.countDocuments({ shopId }),
      Expense.countDocuments({ shopId }),
      Inventory.countDocuments({ shopId }),
      Customer.countDocuments({ shopId }),
      Product.countDocuments({ shopId }),
    ]);

    const totalRecords = salesCount + expensesCount + inventoryCount + customersCount + productsCount;
    // Rough estimation: ~500 bytes per record
    const estimatedSize = (totalRecords * 500) / 1024; // KB

    return res.json({
      success: true,
      data: {
        totalRecords,
        estimatedSizeKB: Math.round(estimatedSize * 100) / 100,
        estimatedSizeMB: Math.round((estimatedSize / 1024) * 100) / 100,
        breakdown: {
          sales: salesCount,
          expenses: expensesCount,
          inventory: inventoryCount,
          customers: customersCount,
          products: productsCount,
        },
        lastBackup: null, // Could be stored in a separate collection
      },
    });
  } catch (error) {
    console.error("Backup info error:", error);
    return res.status(500).json({ success: false, message: "Failed to get backup info" });
  }
};

// Restore from Backup
export const restoreBackup = async (req: Request, res: Response) => {
  try {
    const shopId = getShopId(req);
    const backupData = req.body;

    if (!shopId) {
      return res.status(401).json({ success: false, message: "No active shop selected" });
    }

    // Validate backup data
    if (!backupData || !backupData.data || backupData.version !== "1.0") {
      return res.status(400).json({ success: false, message: "Invalid backup file format" });
    }

    // Verify the backup belongs to this shop
    if (backupData.shopId !== shopId) {
      return res.status(403).json({ success: false, message: "Backup does not belong to this shop" });
    }

    const { sales, expenses, inventory, customers, products } = backupData.data;
    const results = {
      sales: { restored: 0, skipped: 0 },
      expenses: { restored: 0, skipped: 0 },
      inventory: { restored: 0, skipped: 0 },
      customers: { restored: 0, skipped: 0 },
      products: { restored: 0, skipped: 0 },
    };

    // Restore data with upsert to avoid duplicates
    if (Array.isArray(customers)) {
      for (const customer of customers) {
        try {
          await Customer.findByIdAndUpdate(customer._id, customer, { upsert: true });
          results.customers.restored++;
        } catch {
          results.customers.skipped++;
        }
      }
    }

    if (Array.isArray(products)) {
      for (const product of products) {
        try {
          await Product.findByIdAndUpdate(product._id, product, { upsert: true });
          results.products.restored++;
        } catch {
          results.products.skipped++;
        }
      }
    }

    if (Array.isArray(inventory)) {
      for (const inv of inventory) {
        try {
          await Inventory.findByIdAndUpdate(inv._id, inv, { upsert: true });
          results.inventory.restored++;
        } catch {
          results.inventory.skipped++;
        }
      }
    }

    if (Array.isArray(expenses)) {
      for (const expense of expenses) {
        try {
          await Expense.findByIdAndUpdate(expense._id, expense, { upsert: true });
          results.expenses.restored++;
        } catch {
          results.expenses.skipped++;
        }
      }
    }

    if (Array.isArray(sales)) {
      for (const sale of sales) {
        try {
          await Sales.findByIdAndUpdate(sale._id, sale, { upsert: true });
          results.sales.restored++;
        } catch {
          results.sales.skipped++;
        }
      }
    }

    return res.json({
      success: true,
      message: "Backup restored successfully",
      results,
    });
  } catch (error) {
    console.error("Restore error:", error);
    return res.status(500).json({ success: false, message: "Failed to restore backup" });
  }
};

// Clear Local Data (for this shop)
export const clearData = async (req: Request, res: Response) => {
  try {
    const shopId = getShopId(req);
    const { confirmClear } = req.body;

    if (!shopId) {
      return res.status(401).json({ success: false, message: "No active shop selected" });
    }

    if (!confirmClear) {
      return res.status(400).json({ success: false, message: "Confirmation required" });
    }

    // Delete all data for this shop
    const [salesResult, expensesResult, inventoryResult, customersResult, productsResult] = await Promise.all([
      Sales.deleteMany({ shopId }),
      Expense.deleteMany({ shopId }),
      Inventory.deleteMany({ shopId }),
      Customer.deleteMany({ shopId }),
      Product.deleteMany({ shopId }),
    ]);

    return res.json({
      success: true,
      message: "Data cleared successfully",
      deleted: {
        sales: salesResult.deletedCount,
        expenses: expensesResult.deletedCount,
        inventory: inventoryResult.deletedCount,
        customers: customersResult.deletedCount,
        products: productsResult.deletedCount,
      },
    });
  } catch (error) {
    console.error("Clear data error:", error);
    return res.status(500).json({ success: false, message: "Failed to clear data" });
  }
};

// Get Storage Info
export const getStorageInfo = async (req: Request, res: Response) => {
  try {
    const shopId = getShopId(req);

    if (!shopId) {
      return res.status(401).json({ success: false, message: "No active shop selected" });
    }

    // Get document counts and estimate sizes
    const [sales, expenses, inventory, customers, products] = await Promise.all([
      Sales.find({ shopId }).lean(),
      Expense.find({ shopId }).lean(),
      Inventory.find({ shopId }).lean(),
      Customer.find({ shopId }).lean(),
      Product.find({ shopId }).lean(),
    ]);

    // Calculate actual data sizes
    const calculateSize = (data: any[]) => {
      const jsonString = JSON.stringify(data);
      return Buffer.byteLength(jsonString, "utf8");
    };

    const salesSize = calculateSize(sales);
    const expensesSize = calculateSize(expenses);
    const inventorySize = calculateSize(inventory);
    const customersSize = calculateSize(customers);
    const productsSize = calculateSize(products);
    const totalSize = salesSize + expensesSize + inventorySize + customersSize + productsSize;

    const maxStorage = 10 * 1024 * 1024; // 10 MB limit (configurable)

    return res.json({
      success: true,
      data: {
        used: totalSize,
        usedMB: Math.round((totalSize / 1024 / 1024) * 100) / 100,
        max: maxStorage,
        maxMB: maxStorage / 1024 / 1024,
        percentage: Math.round((totalSize / maxStorage) * 100),
        breakdown: {
          sales: { count: sales.length, sizeBytes: salesSize },
          expenses: { count: expenses.length, sizeBytes: expensesSize },
          inventory: { count: inventory.length, sizeBytes: inventorySize },
          customers: { count: customers.length, sizeBytes: customersSize },
          products: { count: products.length, sizeBytes: productsSize },
        },
      },
    });
  } catch (error) {
    console.error("Storage info error:", error);
    return res.status(500).json({ success: false, message: "Failed to get storage info" });
  }
};
