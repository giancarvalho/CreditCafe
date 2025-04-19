import React from 'react';
import { ChevronRight, Phone, Plus } from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency } from '../utils/format';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ 
  customers, 
  onSelectCustomer,
  onAddCustomer
}) => {
  // Helper function to determine the status color based on balance
  const getStatusColor = (balance: number) => {
    if (balance > 100) return 'bg-green-100 text-green-800';
    if (balance >= 0) return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Clientes</h2>
        <button
          onClick={onAddCustomer}
          className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Novo cliente
        </button>
      </div>
      
      {customers.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>Nenhum cliente ainda. Importe uma planilha ou adicione clientes.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {customers.map(customer => (
            <li 
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="p-4 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {customer.name}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Phone size={12} className="mr-1" />
                    <span>{customer.phoneNumber || 'Sem número de telefone'}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${getStatusColor(customer.balance)}`}>
                    {formatCurrency(customer.balance)}
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerList;