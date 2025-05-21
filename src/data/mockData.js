export const categories = [
  { id: 1, name: 'Market', type: 'expense' },
  { id: 2, name: 'Faturalar', type: 'expense' },
  { id: 3, name: 'Ulaşım', type: 'expense' },
  { id: 4, name: 'Maaş', type: 'income' },
  { id: 5, name: 'Freelance', type: 'income' },
];

export const transactions = [
  {
    id: 1,
    type: 'expense',
    amount: 150.50,
    categoryId: 1,
    accountType: 'credit-card',
    date: '2024-03-15T10:30:00',
    description: 'Haftalık market alışverişi'
  },
  {
    id: 2,
    type: 'income',
    amount: 5000,
    categoryId: 4,
    accountType: 'bank',
    date: '2024-03-15T09:00:00',
    description: 'Mart ayı maaşı'
  },
  {
    id: 3,
    type: 'expense',
    amount: 250,
    categoryId: 2,
    accountType: 'bank',
    date: '2024-03-14T15:45:00',
    description: 'Elektrik faturası'
  }
]; 