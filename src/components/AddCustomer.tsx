import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddCustomerProps {
  onAdd: (name: string, phoneNumber: string) => void;
  onCancel: () => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate phone number (basic check)
    if (!phoneNumber.trim()) {
      setPhoneError('Número de telefone é obrigatório');
      isValid = false;
    } else if (!/^\+?[0-9\s\-()]{7,}$/.test(phoneNumber)) {
      setPhoneError('Por favor, insira um número de telefone válido');
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd(name, phoneNumber);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Adicionar Novo Cliente</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Cliente
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                nameError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o nome do cliente"
            />
            {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Telefone
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                phoneError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex.: 34999887766"
            />
            {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
            >
              Adicionar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;