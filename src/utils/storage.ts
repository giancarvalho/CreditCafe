import { Customer } from '../types';

export const STORAGE_KEY = 'restaurant-customers';

export const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
};

export const loadCustomers = (): Customer[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const clearCustomers = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};