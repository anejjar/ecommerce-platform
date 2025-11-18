'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

export default function ImportProductsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    imported?: number;
    skipped?: number;
    errors?: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          imported: data.imported,
          skipped: data.skipped,
          errors: data.errors,
        });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setResult({
          success: false,
          message: data.error || 'Import failed',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred during import',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `Name,SKU,Description,Price,Compare Price,Stock,Category,Featured,Published,Image URL
"Premium Wireless Headphones","WH-001","High-quality wireless headphones with noise cancellation",299.99,349.99,50,"Electronics",true,true,"https://example.com/headphones.jpg"
"Cotton T-Shirt","TS-002","Comfortable cotton t-shirt",29.99,39.99,100,"Clothing",false,true,"https://example.com/tshirt.jpg"
"Yoga Mat","YM-003","Non-slip yoga mat for fitness",49.99,,75,"Sports",false,true,"https://example.com/yogamat.jpg"`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import Products</h1>
          <p className="text-gray-600 mt-2">
            Import products from CSV files (WooCommerce compatible)
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload CSV File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="file-input"
                className="block w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {file ? file.name : 'Click to select CSV file'}
                </span>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              onClick={handleImport}
              disabled={!file || isImporting}
              className="w-full"
            >
              {isImporting ? 'Importing...' : 'Import Products'}
            </Button>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        result.success ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {result.message}
                    </p>
                    {result.success && (
                      <div className="mt-2 text-sm text-green-800">
                        <p>Imported: {result.imported}</p>
                        {result.skipped! > 0 && <p>Skipped: {result.skipped}</p>}
                      </div>
                    )}
                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-2 text-sm text-red-800">
                        <p className="font-medium">Errors:</p>
                        <ul className="list-disc list-inside mt-1">
                          {result.errors.slice(0, 5).map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                          {result.errors.length > 5 && (
                            <li>... and {result.errors.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Supported Formats:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>WooCommerce CSV export format</li>
                <li>Custom CSV format (see sample below)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Required Columns:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Name</li>
                <li>Price</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Optional Columns:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>SKU</li>
                <li>Description</li>
                <li>Compare Price (sale price)</li>
                <li>Stock</li>
                <li>Category</li>
                <li>Featured (true/false)</li>
                <li>Published (true/false)</li>
                <li>Image URL</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={downloadSampleCSV}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample CSV
            </Button>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> Existing products with the same SKU will be
                skipped. Categories will be created if they don't exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
