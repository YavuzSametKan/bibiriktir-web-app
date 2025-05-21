import { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Geliştirme aşamasında her zaman authenticated dön
  const value = {
    isAuthenticated: true,
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test Kullanıcı'
    },
    loading: false,
    login: async () => ({ success: true }),
    logout: () => {}
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 