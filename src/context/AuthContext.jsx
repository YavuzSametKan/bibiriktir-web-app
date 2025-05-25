import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await authService.checkAuth();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Oturum bulunamadı' };
    } catch (error) {
      console.error('Auth kontrolü sırasında hata:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Login başlatılıyor');
      const result = await authService.login({ email, password });
      console.log('AuthContext: Login sonucu:', result);

      if (result.success) {
        console.log('AuthContext: Kullanıcı bilgileri state\'e kaydediliyor:', result.data);
        setUser(result.data);
        setIsAuthenticated(true);
        toast.success('Giriş başarılı!');
        return { success: true, data: result.data };
      }
      console.log('AuthContext: Login başarısız:', result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error('AuthContext: Login hatası:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('hasSeenWelcome');
      toast.success('Çıkış başarılı!');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
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