import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export interface ExportOptions {
  format: "csv" | "excel" | "json" | "pdf";
  dataType: "all" | "sales" | "expenses" | "inventory" | "customers" | "reports";
  includeDeleted?: boolean;
  includeMetadata?: boolean;
}

export interface BackupInfo {
  totalRecords: number;
  estimatedSizeKB: number;
  estimatedSizeMB: number;
  breakdown: {
    sales: number;
    expenses: number;
    inventory: number;
    customers: number;
    products: number;
  };
  lastBackup: string | null;
}

export interface StorageInfo {
  used: number;
  usedMB: number;
  max: number;
  maxMB: number;
  percentage: number;
  breakdown: {
    sales: { count: number; sizeBytes: number };
    expenses: { count: number; sizeBytes: number };
    inventory: { count: number; sizeBytes: number };
    customers: { count: number; sizeBytes: number };
    products: { count: number; sizeBytes: number };
  };
}

export interface RestoreResult {
  sales: { restored: number; skipped: number };
  expenses: { restored: number; skipped: number };
  inventory: { restored: number; skipped: number };
  customers: { restored: number; skipped: number };
  products: { restored: number; skipped: number };
}

export interface ClearDataResult {
  sales: number;
  expenses: number;
  inventory: number;
  customers: number;
  products: number;
}

// Export data in specified format - triggers file download
async function exportData(options: ExportOptions): Promise<void> {
  const params = new URLSearchParams({
    format: options.format,
    dataType: options.dataType,
    includeDeleted: String(options.includeDeleted || false),
    includeMetadata: String(options.includeMetadata || false),
  });

  const response = await api.get(`/data-management/export?${params.toString()}`, {
    responseType: "blob",
  });

  // Get filename from content-disposition header or generate one
  const contentDisposition = response.headers["content-disposition"];
  let filename = `export_${Date.now()}`;
  
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
    if (filenameMatch) {
      filename = filenameMatch[1].replace(/"/g, "");
    }
  } else {
    // Add appropriate extension based on format
    const extensions: Record<string, string> = {
      csv: ".csv",
      excel: ".xlsx",
      json: ".json",
      pdf: ".pdf",
    };
    filename += extensions[options.format] || "";
  }

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// Get backup information
async function getBackupInfo(): Promise<BackupInfo> {
  const response = await api.get("/data-management/backup/info");
  return response.data.data;
}

// Create a backup - triggers file download
async function createBackup(options?: { includeMedia?: boolean; encrypt?: boolean }): Promise<void> {
  const response = await api.post("/data-management/backup", options || {}, {
    responseType: "blob",
  });

  // Get filename from content-disposition header or generate one
  const contentDisposition = response.headers["content-disposition"];
  let filename = `backup_${Date.now()}.json`;
  
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
    if (filenameMatch) {
      filename = filenameMatch[1].replace(/"/g, "");
    }
  }

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// Restore data from backup file
async function restoreBackup(backupFile: File): Promise<RestoreResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const backupData = JSON.parse(event.target?.result as string);
        const response = await api.post("/data-management/restore", backupData);
        resolve(response.data.results);
      } catch (error) {
        reject(new Error("Invalid backup file format"));
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read backup file"));
    reader.readAsText(backupFile);
  });
}

// Get storage information
async function getStorageInfo(): Promise<StorageInfo> {
  const response = await api.get("/data-management/storage");
  return response.data.data;
}

// Clear all data for the current shop
async function clearData(): Promise<ClearDataResult> {
  const response = await api.post("/data-management/clear", { confirmClear: true });
  return response.data.deleted;
}

export const dataManagementApi = {
  exportData,
  getBackupInfo,
  createBackup,
  restoreBackup,
  getStorageInfo,
  clearData,
};

export default dataManagementApi;
