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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Exportar clientes</h2>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center mb-6">
        <FileSpreadsheet size={48} className="mx-auto mb-4 text-amber-600" />
        
        <p className="text-gray-700 mb-4">
          Exporte todos os dados dos clientes para uma planilha. 
          Isso incluirá todas as informações dos clientes e seus históricos de transações.
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          {customers.length} cliente{customers.length !== 1 ? 's' : ''} disponíveis para exportação
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
          Exportar para Excel
        </button>
      </div>
      
      <div className="text-sm text-gray-700">
        <h3 className="font-medium mb-2">Informação de exportação</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>O arquivo de exportação estará em formato do Excel (.xlsx)</li>
            <li>Todos os dados dos clientes, incluindo o histórico de transações, serão exportados</li>
            <li>Você pode re-importar este arquivo posteriormente, se necessário</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportData;