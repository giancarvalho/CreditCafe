import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Transaction } from '../types';
import { saveCustomers, loadCustomers } from '../utils/storage';

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addTransaction: (customerId: string, transaction: Omit<Transaction, 'id' | 'date'>) => Customer;
  getCustomerById: (costumerId: string) => Customer;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load customers from local storage on mount
  useEffect(() => {
    setCustomers(loadCustomers());
    setLoading(false);
  }, []);

  // Save customers to local storage when they change
  useEffect(() => {
    if (!loading) {
      saveCustomers(customers);
    }
  }, [customers, loading]);

  // Add a new customer
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...customer,
      id: `customer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };
    
    setCustomers(prev => [...prev, newCustomer]);
  };

  // Update an existing customer
  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === updatedCustomer.id 
          ? { ...updatedCustomer, updatedAt: new Date().toISOString() } 
          : customer
      )
    );
  };

  // Delete a customer
  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find(costumer => costumer.id === id)
  }

  // Add a transaction to a customer
  const addTransaction = (
    customerId: string, 
    transaction: Omit<Transaction, 'id' | 'date'>
  ) => {
    let customerReturn;
    setCustomers(prev => {
      return prev.map(customer => {
        if (customer.id === customerId) {
          const newTransaction: Transaction = {
            ...transaction,
            id: `transaction-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            date: new Date().toISOString()
          };
          
          // Calculate new balance
          const balanceChange = transaction.type === 'add' 
            ? transaction.amount 
            : -transaction.amount;
          
          const updatedCustomer = {
            ...customer,
            balance: customer.balance + balanceChange,
            transactions: [...customer.transactions, newTransaction],
            updatedAt: new Date().toISOString()
          };

          customerReturn = updatedCustomer;
          return updatedCustomer;
        }
        return customer;
      });
    });
    return customerReturn;
  };

  const value = {
    customers,
    loading,
    setCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addTransaction,
    getCustomerById
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};