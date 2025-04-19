import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Customer } from '../types';
import { exportToSpreadsheet } from '../utils/spreadsheet';

interface ExportDataProps {
  customers: Customer[];
}

const ExportData: React.FC<ExportDataProps> = ({ customers }) => {
  const handleExport = () => {
    exportToSpreadsheet(customers);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Customer Data</h2>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center mb-6">
        <FileSpreadsheet size={48} className="mx-auto mb-4 text-amber-600" />
        
        <p className="text-gray-700 mb-4">
          Export all customer data to a spreadsheet file. 
          This will include all customer information and their transaction histories.
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          {customers.length} customer{customers.length !== 1 ? 's' : ''} available for export
        </p>
        
        <button
          onClick={handleExport}
          disabled={customers.length === 0}
          className={`px-4 py-2 rounded-md text-white font-medium flex items-center mx-auto ${
            customers.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-amber-700 hover:bg-amber-800 transition-colors'
          }`}
        >
          <Download size={18} className="mr-2" />
          Export to Excel
        </button>
      </div>
      
      <div className="text-sm text-gray-700">
        <h3 className="font-medium mb-2">Export Information:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>The exported file will be in Excel format (.xlsx)</li>
          <li>All customer data including transaction history will be exported</li>
          <li>You can re-import this file later if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportData;