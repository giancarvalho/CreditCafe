import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Customer } from '../types';

interface CustomerSearchProps {
  customers: Customer[];
  onResultsChange: (filteredCustomers: Customer[]) => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({ customers, onResultsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      onResultsChange(customers);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(lowercasedSearch) || 
      customer.phoneNumber.includes(searchTerm)
    );
    
    onResultsChange(filtered);
  }, [searchTerm, JSON.stringify(customers)]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
        />
        <input
          type="text"
          placeholder="Procure por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerSearch;