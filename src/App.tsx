import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { CustomerProvider, useCustomers } from './context/CustomerContext';
import Header from './components/Header';
import CustomerSearch from './components/CustomerSearch';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import ImportSpreadsheet from './components/ImportSpreadsheet';
import ExportData from './components/ExportData';
import AddCustomer from './components/AddCustomer';
import { Customer } from './types';

function MainApp() {
  const { 
    customers, 
    loading, 
    setCustomers,
    addCustomer, 
    deleteCustomer,
    addTransaction
  } = useCustomers();
  
  const [currentView, setCurrentView] = useState('customers');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Handle navigation
  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setSelectedCustomer(null);
  };

  // Handle search results
  const handleSearchResults = (results: Customer[]) => {
    setFilteredCustomers(results);
  };

  // Handle customer selection
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Handle adding a new customer
  const handleAddNewCustomer = (name: string, phoneNumber: string) => {
    addCustomer({
      name,
      phoneNumber,
      balance: 0,
      transactions: []
    });
    setShowAddCustomer(false);
    toast.success(`Added new customer: ${name}`);
  };

  // Handle customer deletion
  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    toast.success('Customer deleted successfully');
  };

  // Handle import success
  const handleImportSuccess = (importedCustomers: Customer[]) => {
    setCustomers([...customers, ...importedCustomers]);
    toast.success(`Imported ${importedCustomers.length} customers`);
    setCurrentView('customers');
  };

  // Handle transaction addition
  const handleAddTransaction = (
    customerId: string, 
    transaction: { amount: number; description: string; type: 'add' | 'subtract' }
  ) => {
    addTransaction(customerId, transaction);
    toast.success(
      `${transaction.type === 'add' ? 'Added' : 'Subtracted'} credit: $${transaction.amount.toFixed(2)}`
    );
  };

  // Render different views based on current state
  const renderView = () => {
    // If a customer is selected, show customer detail view
    if (selectedCustomer) {
      return (
        <CustomerDetail
          customer={selectedCustomer}
          onBack={() => setSelectedCustomer(null)}
          onAddTransaction={handleAddTransaction}
          onDeleteCustomer={handleDeleteCustomer}
        />
      );
    }

    // Otherwise, show the main view based on navigation
    switch (currentView) {
      case 'import':
        return <ImportSpreadsheet onImportSuccess={handleImportSuccess} />;
      case 'export':
        return <ExportData customers={customers} />;
      case 'customers':
      default:
        return (
          <>
            <CustomerSearch 
              customers={customers} 
              onResultsChange={handleSearchResults} 
            />
            <CustomerList 
              customers={filteredCustomers.length > 0 ? filteredCustomers : customers}
              onSelectCustomer={handleSelectCustomer}
              onAddCustomer={() => setShowAddCustomer(true)}
            />
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading customer data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onNavClick={handleNavClick} currentView={currentView} />
      
      <main className="container mx-auto px-4 py-6">
        {renderView()}
      </main>
      
      {showAddCustomer && (
        <AddCustomer 
          onAdd={handleAddNewCustomer}
          onCancel={() => setShowAddCustomer(false)}
        />
      )}
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#1F2937',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.375rem',
            padding: '0.75rem 1rem',
          },
          success: {
            iconTheme: {
              primary: '#B45309',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <CustomerProvider>
      <MainApp />
    </CustomerProvider>
  );
}

export default App;