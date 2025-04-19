export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'add' | 'subtract';
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  balance: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}