import * as XLSX from 'xlsx';
import { Customer, Transaction } from '../types';

export const importFromSpreadsheet = (file: File): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Process the data to match our Customer type
        const customers: Customer[] = jsonData.map((row: any, index) => {
          // Extract transactions from row data if available
          const transactions: Transaction[] = [];
          
          // Check if transaction data exists in the row
          if (row.transactions) {
            try {
              const parsedTransactions = JSON.parse(row.transactions);
              if (Array.isArray(parsedTransactions)) {
                parsedTransactions.forEach((t: any) => {
                  transactions.push({
                    id: t.id || `import-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    date: t.date || new Date().toISOString(),
                    amount: Number(t.amount) || 0,
                    type: t.type === 'subtract' ? 'subtract' : 'add',
                    description: t.description || ''
                  });
                });
              }
            } catch (err) {
              console.warn('Failed to parse transactions', err);
            }
          }
          
          return {
            id: row.id || `customer-${Date.now()}-${index}`,
            name: row.name || 'Unknown Customer',
            phoneNumber: row.phoneNumber || '',
            balance: Number(row.balance) || 0,
            transactions: transactions,
            createdAt: row.createdAt || new Date().toISOString(),
            updatedAt: row.updatedAt || new Date().toISOString()
          };
        });
        
        resolve(customers);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const exportToSpreadsheet = (customers: Customer[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    phoneNumber: customer.phoneNumber,
    balance: customer.balance,
    transactions: JSON.stringify(customer.transactions),
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt
  })));
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
  
  XLSX.writeFile(workbook, 'restaurant-customers.xlsx');
};