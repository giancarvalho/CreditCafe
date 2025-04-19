import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TransactionFormProps {
  title: string;
  type: 'add' | 'subtract';
  onSubmit: (amount: number, description: string) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  title, 
  type, 
  onSubmit, 
  onCancel 
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [amountError, setAmountError] = useState('');
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate amount
    if (!amount) {
      setAmountError('O valor é obrigatório');
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError('Por favor, entre um valor positivo');
      isValid = false;
    } else {
      setAmountError('');
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(Number(amount), description);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className={`flex justify-between items-center p-4 border-b border-gray-200 ${
          type === 'add' ? 'bg-blue-600' : 'bg-amber-600'
        } text-white`}>
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onCancel} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                id="amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full p-2 pl-8 border rounded-md focus:ring-2 ${
                  type === 'add' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-amber-500 focus:border-amber-500'
                } transition-all ${
                  amountError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {amountError && <p className="mt-1 text-sm text-red-600">{amountError}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 ${
                type === 'add' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-amber-500 focus:border-amber-500'
              } transition-all`}
              placeholder={type === 'add' ? "e.g., Depósito" : "e.g., Marmita"}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md transition-colors ${
                type === 'add' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {type === 'add' ? 'Adicionar Crédito' : 'Subtrair Crédito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;