import React from 'react';
import { Coffee } from 'lucide-react';

interface HeaderProps {
  onNavClick: (view: string) => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavClick, currentView }) => {
  const navItems = [
    { id: 'customers', label: 'Customers' },
    { id: 'import', label: 'Import Data' },
    { id: 'export', label: 'Export Data' }
  ];

  return (
    <header className="bg-gradient-to-r from-amber-800 to-amber-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Coffee size={28} className="mr-2" />
            <h1 className="text-2xl font-bold">Credit Café</h1>
          </div>
          
          <nav className="flex space-x-1 overflow-x-auto w-full md:w-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 
                  ${currentView === item.id 
                    ? 'bg-white text-amber-800 shadow-sm' 
                    : 'text-white hover:bg-white/10'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;