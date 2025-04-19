import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Send, Trash2 } from 'lucide-react';
import { Customer, Transaction } from '../types';
import { formatCurrency, formatDate, createWhatsAppShareUrl } from '../utils/format';
import TransactionForm from './TransactionForm';

interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
  onAddTransaction: (customerId: string, transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onDeleteCustomer: (id: string) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ 
  customer, 
  onBack,
  onAddTransaction,
  onDeleteCustomer
}) => {
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [showSubtractCredit, setShowSubtractCredit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get recent transactions, sorted by date (newest first)
  const recentTransactions = [...customer.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleShare = () => {
    const shareUrl = createWhatsAppShareUrl(customer);
    window.open(shareUrl, '_blank');
  };

  const handleAddTransaction = (amount: number, description: string, type: 'add' | 'subtract') => {
    onAddTransaction(customer.id, { amount, description, type });
    setShowAddCredit(false);
    setShowSubtractCredit(false);
  };

  const handleDeleteCustomer = () => {
    onDeleteCustomer(customer.id);
    onBack();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-amber-700 text-white">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 hover:bg-amber-600 rounded-full p-1 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">{customer.name}</h2>
            <p className="text-amber-100">{customer.phoneNumber || 'No phone number'}</p>
          </div>
        </div>
      </div>
      
      {/* Balance Card */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className={`text-2xl font-bold ${
              customer.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(customer.balance)}
            </p>
          </div>
          
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Send size={16} className="mr-2" />
            WhatsApp
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddCredit(true)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Plus size={16} className="mr-1" />
            Add Credit
          </button>
          
          <button
            onClick={() => setShowSubtractCredit(true)}
            className="flex-1 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center justify-center"
          >
            <Minus size={16} className="mr-1" />
            Subtract Credit
          </button>
        </div>
      </div>
      
      {/* Transactions */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction History</h3>
        
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet.</p>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction.description || 'No description'}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${
                      transaction.type === 'add' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'add' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Delete customer button */}
      <div className="p-4 border-t border-gray-200">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Customer
          </button>
        ) : (
          <div className="bg-red-50 p-3 rounded-md">
            <p className="text-red-700 mb-2">Are you sure you want to delete this customer?</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Transaction forms */}
      {showAddCredit && (
        <TransactionForm
          title="Add Credit"
          type="add"
          onSubmit={(amount, description) => handleAddTransaction(amount, description, 'add')}
          onCancel={() => setShowAddCredit(false)}
        />
      )}
      
      {showSubtractCredit && (
        <TransactionForm
          title="Subtract Credit"
          type="subtract"
          onSubmit={(amount, description) => handleAddTransaction(amount, description, 'subtract')}
          onCancel={() => setShowSubtractCredit(false)}
        />
      )}
    </div>
  );
};

export default CustomerDetail;