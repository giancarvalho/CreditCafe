import React, { useState } from 'react';
import { FileSpreadsheet, Upload, AlertCircle, Check } from 'lucide-react';
import { importFromSpreadsheet } from '../utils/spreadsheet';
import { Customer } from '../types';
import { clearCustomers } from '../utils/storage';

interface ImportSpreadsheetProps {
  onImportSuccess: (customers: Customer[]) => void;
}

const ImportSpreadsheet: React.FC<ImportSpreadsheetProps> = ({ onImportSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    // Check if file is a valid spreadsheet
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Por favor, importe um planilha válida');
      setFile(null);
      return;
    }
    
    setFile(file);
    setError(null);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      clearCustomers();
      const importedCustomers = await importFromSpreadsheet(file);
      onImportSuccess(importedCustomers);
      setSuccessMessage(`Importamos ${importedCustomers.length} clientes.`);
      setFile(null);
    } catch (err) {
      setError('Erro ao importar a planilha. Verifique se a planilha é valida.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Importar Clientes</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-all
          ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileSpreadsheet 
          size={48} 
          className={`mx-auto mb-4 ${file ? 'text-amber-600' : 'text-gray-400'}`} 
        />
        
        <p className="text-gray-600 mb-4">
          {file 
            ? `Selected file: ${file.name}` 
            : 'Arraste seu arquivo para cá ou clique para navegar por seus arquivos'}
        </p>
        
        <input
          type="file"
          id="spreadsheet-upload"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
        />
        
        <label
          htmlFor="spreadsheet-upload"
          className="inline-block px-4 py-2 bg-amber-700 text-white rounded-md cursor-pointer hover:bg-amber-800 transition-colors"
        >
          <span className="flex items-center">
            <Upload size={16} className="mr-2" />
            Navegar arquivos
          </span>
        </label>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
          <Check size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}
      
      <button
        onClick={handleImport}
        disabled={!file || isLoading}
        className={`w-full py-2 rounded-md text-white font-medium ${
          !file || isLoading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-amber-700 hover:bg-amber-800 transition-colors'
        }`}
      >
        {isLoading ? 'Importando...' : 'Import'}
      </button>
      
      <div className="mt-4 text-sm text-gray-600">

        <p className="font-medium mb-3">ATENÇÃO: seus dados atuais serão substituidos pelos dados da planilha</p>

        <p className="font-medium mb-1">Formato esperado da planilha:</p>
        <ul className="list-disc list-inside space-y-1">
            <li>Colunas: nome, telefone, saldo</li>
            <li>Colunas opcionais: transações (string JSON)</li>
            <li>Um cliente por linha</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportSpreadsheet;