import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    addTransaction,
  } = useCustomers();
  
  const [currentView, setCurrentView] = useState('clientes');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Lidar com navegação
  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setSelectedCustomer(null);
  };

  // Lidar com resultados de busca
  const handleSearchResults = (results: Customer[]) => {
    setFilteredCustomers(results);
  };

  // Lidar com seleção de cliente
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Lidar com adição de novo cliente
  const handleAddNewCustomer = (name: string, phoneNumber: string) => {
    addCustomer({
      name,
      phoneNumber,
      balance: 0,
      transactions: []
    });
    setShowAddCustomer(false);
    toast.success(`Novo cliente adicionado: ${name}`);
  };

  // Lidar com exclusão de cliente
  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    toast.success('Cliente excluído com sucesso');
  };

  // Lidar com sucesso na importação
  const handleImportSuccess = (importedCustomers: Customer[]) => {
    setCustomers([...importedCustomers]);
    toast.success(`Importados ${importedCustomers.length} clientes`);
    setCurrentView('clientes');
  };

  // Lidar com adição de transação
  const handleAddTransaction = (
    customerId: string, 
    transaction: { amount: number; description: string; type: 'add' | 'subtract' }
  ) => {
    const updatedCustomer = addTransaction(customerId, transaction);
    toast.success(
      `${transaction.type === 'add' ? 'Adicionado' : 'Subtraído'} crédito: R$${transaction.amount.toFixed(2)}`
    );
    console.log(updatedCustomer);

    handleSelectCustomer(updatedCustomer);
  };

  // Renderizar diferentes visualizações com base no estado atual
  const renderView = () => {
    // Se um cliente estiver selecionado, mostrar a visualização de detalhes do cliente
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

    // Caso contrário, mostrar a visualização principal com base na navegação
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
        <p className="text-gray-600">Carregando dados dos clientes...</p>
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
      
<ToastContainer 
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
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