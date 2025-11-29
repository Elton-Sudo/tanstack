/**
 * Data Export Utilities
 * Functions for exporting data to various formats (CSV, JSON, PDF)
 */

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  options?: {
    headers?: string[];
    filename?: string;
    delimiter?: string;
  },
): string {
  if (data.length === 0) return '';

  const delimiter = options?.delimiter || ',';
  const headers = options?.headers || Object.keys(data[0]);

  // Create header row
  const headerRow = headers.map((header) => escapeCSVValue(header)).join(delimiter);

  // Create data rows
  const dataRows = data.map((row) => {
    return headers.map((header) => escapeCSVValue(row[header])).join(delimiter);
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  // If value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Download data as CSV file
 */
export function downloadCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv',
  options?: {
    headers?: string[];
    delimiter?: string;
  },
): void {
  const csv = convertToCSV(data, { ...options, filename });
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Download data as JSON file
 */
export function downloadJSON<T>(
  data: T,
  filename: string = 'export.json',
  pretty: boolean = true,
): void {
  const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  downloadFile(json, filename, 'application/json;charset=utf-8;');
}

/**
 * Download file helper
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Copy data to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Export table data with formatting
 */
export interface ExportColumn<T> {
  key: keyof T;
  label: string;
  format?: (value: any) => string;
}

export function exportTableData<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string,
  format: 'csv' | 'json' = 'csv',
): void {
  if (format === 'json') {
    // Export as JSON
    const jsonData = data.map((row) => {
      const exportRow: Record<string, any> = {};
      columns.forEach((col) => {
        const value = row[col.key];
        exportRow[col.label] = col.format ? col.format(value) : value;
      });
      return exportRow;
    });
    downloadJSON(jsonData, filename);
  } else {
    // Export as CSV
    const headers = columns.map((col) => col.label);
    const csvData = data.map((row) => {
      const exportRow: Record<string, any> = {};
      columns.forEach((col) => {
        const value = row[col.key];
        exportRow[col.label] = col.format ? col.format(value) : value;
      });
      return exportRow;
    });
    downloadCSV(csvData, filename, { headers });
  }
}

/**
 * Common formatters for export
 */
export const exportFormatters = {
  date: (value: string | Date) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString();
  },

  datetime: (value: string | Date) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleString();
  },

  currency: (value: number, currency: string = 'USD') => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  },

  percent: (value: number) => {
    if (value === null || value === undefined) return '';
    return `${value}%`;
  },

  boolean: (value: boolean) => {
    return value ? 'Yes' : 'No';
  },

  truncate: (maxLength: number) => (value: string) => {
    if (!value) return '';
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
  },
};

/**
 * Batch export with progress callback
 */
export async function batchExport<T extends Record<string, any>>(
  getData: (page: number, pageSize: number) => Promise<T[]>,
  totalItems: number,
  filename: string,
  options?: {
    pageSize?: number;
    format?: 'csv' | 'json';
    onProgress?: (progress: number) => void;
  },
): Promise<void> {
  const pageSize = options?.pageSize || 1000;
  const format = options?.format || 'csv';
  const totalPages = Math.ceil(totalItems / pageSize);

  let allData: T[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const pageData = await getData(page, pageSize);
    allData = [...allData, ...pageData];

    if (options?.onProgress) {
      const progress = (page / totalPages) * 100;
      options.onProgress(progress);
    }
  }

  if (format === 'json') {
    downloadJSON(allData, filename);
  } else {
    downloadCSV(allData, filename);
  }
}
