// Format currency with 2 decimal places
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date in a more readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Create WhatsApp share URL with customer information
export const createWhatsAppShareUrl = (customer: {
  name: string;
  balance: number;
  phoneNumber: string;
  transactions: Array<{
    date: string;
    amount: number;
    type: string;
    description: string;
  }>;
}): string => {
  // Get the 5 most recent transactions
  const recentTransactions = [...customer.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Format the message
  let message = `Olá ${customer.name}, seu saldo é ${formatCurrency(customer.balance)}.\n\n`;
  
  if (recentTransactions.length > 0) {
    message += "Transações recentes:\n";
    recentTransactions.forEach((transaction, index) => {
      const formattedDate = formatDate(transaction.date);
      const prefix = transaction.type === 'add' ? '+' : '-';
      message += `${index + 1}. ${formattedDate}: ${prefix}${formatCurrency(Math.abs(transaction.amount))} - ${transaction.description}\n`;
    });
  }
  
  // Encode the message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  
  // Format phone number by removing non-numeric characters
  const formattedPhone = customer.phoneNumber.replace(/\D/g, '');
  
  return `https://wa.me/+55${formattedPhone}?text=${encodedMessage}`;
};