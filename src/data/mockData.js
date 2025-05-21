export const categories = [
  { id: 1, name: 'Market', type: 'expense' },
  { id: 2, name: 'Faturalar', type: 'expense' },
  { id: 3, name: 'Ulaşım', type: 'expense' },
  { id: 4, name: 'Maaş', type: 'income' },
  { id: 5, name: 'Freelance', type: 'income' },
  { id: 6, name: 'Kira', type: 'expense' },
  { id: 7, name: 'Sağlık', type: 'expense' },
  { id: 8, name: 'Eğlence', type: 'expense' },
  { id: 9, name: 'Giyim', type: 'expense' },
  { id: 10, name: 'Ek Gelir', type: 'income' }
];

export const transactions = [
  // Mayıs 2025
  {
    id: 1,
    type: 'expense',
    amount: 150.50,
    categoryId: 1,
    accountType: 'credit-card',
    date: '2025-05-15T10:30:00',
    description: 'Haftalık market alışverişi'
  },
  {
    id: 2,
    type: 'income',
    amount: 5000,
    categoryId: 4,
    accountType: 'bank',
    date: '2025-05-15T09:00:00',
    description: 'Mayıs ayı maaşı'
  },
  {
    id: 3,
    type: 'expense',
    amount: 250,
    categoryId: 2,
    accountType: 'bank',
    date: '2025-05-14T15:45:00',
    description: 'Elektrik faturası'
  },
  {
    id: 4,
    type: 'expense',
    amount: 100,
    categoryId: 3,
    accountType: 'credit-card',
    date: '2025-05-16T08:30:00',
    description: 'Taksi ücreti'
  },
  {
    id: 5,
    type: 'expense',
    amount: 3500,
    categoryId: 6,
    accountType: 'bank',
    date: '2025-05-01T10:00:00',
    description: 'Mayıs ayı kirası'
  },
  {
    id: 6,
    type: 'expense',
    amount: 450,
    categoryId: 7,
    accountType: 'credit-card',
    date: '2025-05-20T14:20:00',
    description: 'Doktor randevusu'
  },
  {
    id: 7,
    type: 'expense',
    amount: 1200,
    categoryId: 9,
    accountType: 'credit-card',
    date: '2025-05-25T16:45:00',
    description: 'Yazlık kıyafet alışverişi'
  },
  {
    id: 8,
    type: 'income',
    amount: 2000,
    categoryId: 5,
    accountType: 'bank',
    date: '2025-05-28T11:30:00',
    description: 'Freelance proje ödemesi'
  },

  // Nisan 2025
  {
    id: 9,
    type: 'income',
    amount: 5000,
    categoryId: 4,
    accountType: 'bank',
    date: '2025-04-15T09:00:00',
    description: 'Nisan ayı maaşı'
  },
  {
    id: 10,
    type: 'expense',
    amount: 3500,
    categoryId: 6,
    accountType: 'bank',
    date: '2025-04-01T10:00:00',
    description: 'Nisan ayı kirası'
  },
  {
    id: 11,
    type: 'expense',
    amount: 180.75,
    categoryId: 1,
    accountType: 'credit-card',
    date: '2025-04-08T11:20:00',
    description: 'Market alışverişi'
  },
  {
    id: 12,
    type: 'expense',
    amount: 280,
    categoryId: 2,
    accountType: 'bank',
    date: '2025-04-10T14:30:00',
    description: 'Su faturası'
  },
  {
    id: 13,
    type: 'expense',
    amount: 150,
    categoryId: 3,
    accountType: 'credit-card',
    date: '2025-04-12T08:15:00',
    description: 'Metro kart yükleme'
  },
  {
    id: 14,
    type: 'expense',
    amount: 350,
    categoryId: 8,
    accountType: 'credit-card',
    date: '2025-04-20T19:45:00',
    description: 'Sinema ve yemek'
  },
  {
    id: 15,
    type: 'income',
    amount: 1500,
    categoryId: 10,
    accountType: 'bank',
    date: '2025-04-25T13:20:00',
    description: 'Ek iş ödemesi'
  },

  // Mart 2025
  {
    id: 16,
    type: 'income',
    amount: 5000,
    categoryId: 4,
    accountType: 'bank',
    date: '2025-03-15T09:00:00',
    description: 'Mart ayı maaşı'
  },
  {
    id: 17,
    type: 'expense',
    amount: 3500,
    categoryId: 6,
    accountType: 'bank',
    date: '2025-03-01T10:00:00',
    description: 'Mart ayı kirası'
  },
  {
    id: 18,
    type: 'expense',
    amount: 220.50,
    categoryId: 1,
    accountType: 'credit-card',
    date: '2025-03-05T12:30:00',
    description: 'Market alışverişi'
  },
  {
    id: 19,
    type: 'expense',
    amount: 300,
    categoryId: 2,
    accountType: 'bank',
    date: '2025-03-08T15:45:00',
    description: 'Doğalgaz faturası'
  },
  {
    id: 20,
    type: 'expense',
    amount: 800,
    categoryId: 7,
    accountType: 'credit-card',
    date: '2025-03-12T10:20:00',
    description: 'Diş tedavisi'
  },
  {
    id: 21,
    type: 'expense',
    amount: 200,
    categoryId: 3,
    accountType: 'credit-card',
    date: '2025-03-18T09:30:00',
    description: 'Taksi ücreti'
  },
  {
    id: 22,
    type: 'expense',
    amount: 450,
    categoryId: 8,
    accountType: 'credit-card',
    date: '2025-03-22T20:15:00',
    description: 'Konser bileti'
  },
  {
    id: 23,
    type: 'income',
    amount: 3000,
    categoryId: 5,
    accountType: 'bank',
    date: '2025-03-28T14:40:00',
    description: 'Freelance proje ödemesi'
  },

  // Şubat 2025
  {
    id: 24,
    type: 'income',
    amount: 5000,
    categoryId: 4,
    accountType: 'bank',
    date: '2025-02-15T09:00:00',
    description: 'Şubat ayı maaşı'
  },
  {
    id: 25,
    type: 'expense',
    amount: 3500,
    categoryId: 6,
    accountType: 'bank',
    date: '2025-02-01T10:00:00',
    description: 'Şubat ayı kirası'
  },
  {
    id: 26,
    type: 'expense',
    amount: 190.25,
    categoryId: 1,
    accountType: 'credit-card',
    date: '2025-02-07T11:45:00',
    description: 'Market alışverişi'
  },
  {
    id: 27,
    type: 'expense',
    amount: 250,
    categoryId: 2,
    accountType: 'bank',
    date: '2025-02-10T14:20:00',
    description: 'İnternet faturası'
  },
  {
    id: 28,
    type: 'expense',
    amount: 1200,
    categoryId: 9,
    accountType: 'credit-card',
    date: '2025-02-14T16:30:00',
    description: 'Kışlık mont'
  },
  {
    id: 29,
    type: 'expense',
    amount: 180,
    categoryId: 3,
    accountType: 'credit-card',
    date: '2025-02-20T08:45:00',
    description: 'Metro kart yükleme'
  },
  {
    id: 30,
    type: 'expense',
    amount: 300,
    categoryId: 8,
    accountType: 'credit-card',
    date: '2025-02-25T19:30:00',
    description: 'Tiyatro bileti'
  },

  // Ocak 2025
  {
    id: 31,
    type: 'income',
    amount: 5000,
    categoryId: 4,
    accountType: 'bank',
    date: '2025-01-15T09:00:00',
    description: 'Ocak ayı maaşı'
  },
  {
    id: 32,
    type: 'expense',
    amount: 3500,
    categoryId: 6,
    accountType: 'bank',
    date: '2025-01-01T10:00:00',
    description: 'Ocak ayı kirası'
  },
  {
    id: 33,
    type: 'expense',
    amount: 210.75,
    categoryId: 1,
    accountType: 'credit-card',
    date: '2025-01-05T12:15:00',
    description: 'Market alışverişi'
  },
  {
    id: 34,
    type: 'expense',
    amount: 270,
    categoryId: 2,
    accountType: 'bank',
    date: '2025-01-08T15:30:00',
    description: 'Elektrik faturası'
  },
  {
    id: 35,
    type: 'expense',
    amount: 150,
    categoryId: 3,
    accountType: 'credit-card',
    date: '2025-01-12T09:45:00',
    description: 'Taksi ücreti'
  },
  {
    id: 36,
    type: 'expense',
    amount: 600,
    categoryId: 7,
    accountType: 'credit-card',
    date: '2025-01-18T11:20:00',
    description: 'Göz muayenesi'
  },
  {
    id: 37,
    type: 'expense',
    amount: 900,
    categoryId: 9,
    accountType: 'credit-card',
    date: '2025-01-22T17:30:00',
    description: 'Yeni ayakkabı'
  },
  {
    id: 38,
    type: 'expense',
    amount: 250,
    categoryId: 8,
    accountType: 'credit-card',
    date: '2025-01-28T20:15:00',
    description: 'Restoran'
  },
  {
    id: 39,
    type: 'income',
    amount: 2500,
    categoryId: 5,
    accountType: 'bank',
    date: '2025-01-30T13:40:00',
    description: 'Freelance proje ödemesi'
  },
  {
    id: 40,
    type: 'income',
    amount: 1000,
    categoryId: 10,
    accountType: 'bank',
    date: '2025-01-31T16:20:00',
    description: 'Ek iş ödemesi'
  }
]; 