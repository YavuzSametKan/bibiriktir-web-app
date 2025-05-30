import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { BanknotesIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Şifre input'u için yeni bir bileşen oluşturalım
function PasswordInput({ value, onChange, showPassword, setShowPassword, id, name, label, placeholder, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          required
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          tabIndex="-1"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const segment = searchParams.get('segment');
    if (segment === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(err.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setRegisterErrors({});
    setLoading(true);

    // Validasyonlar
    const errors = {};
    if (!registerData.firstName) errors.firstName = 'Ad alanı zorunludur';
    if (!registerData.lastName) errors.lastName = 'Soyad alanı zorunludur';
    if (!registerData.email) errors.email = 'E-posta alanı zorunludur';
    if (!registerData.password) errors.password = 'Şifre alanı zorunludur';
    if (!registerData.confirmPassword) errors.confirmPassword = 'Şifre tekrarı zorunludur';
    if (!registerData.birthDate) errors.birthDate = 'Doğum tarihi zorunludur';

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        birthDate: registerData.birthDate,
      });

      if (result.success) {
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
        setActiveTab('login');
        setEmail(registerData.email);
        setError('');
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Kayıt işlemi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Görsel ve Bilgi */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12">
        <div className="max-w-lg mx-auto flex flex-col justify-center text-white">
          <div className="flex justify-center space-x-6 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <BanknotesIcon className="h-8 w-8 text-white" />
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-6">Finansal Hedeflerinize Ulaşın</h1>
          <p className="text-lg text-white/80 mb-8">
            Birikimlerinizi takip edin, hedeflerinize ulaşın ve finansal geleceğinizi güvence altına alın.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-semibold">1</span>
              </div>
              <p>Hedeflerinizi belirleyin</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-semibold">2</span>
              </div>
              <p>Gelir ve giderlerinizi takip edin</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-semibold">3</span>
              </div>
              <p>Finansal raporlarınızı görüntüleyin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Segment Control */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Hoş Geldiniz
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Hesabınıza giriş yaparak devam edin
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta adresi
                      </label>
                      <input
                        id="email-address"
                        name="text"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-200"
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <PasswordInput
                      id="password"
                      name="password"
                      label="Şifre"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Giriş Yap'
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form className="space-y-6" onSubmit={handleRegister}>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Yeni Hesap Oluştur
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Birikimlerinizi yönetmeye hemen başlayın
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad
                      </label>
                      <input
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soyad
                      </label>
                      <input
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    />
                  </div>

                  <PasswordInput
                    id="register-password"
                    name="register-password"
                    label="Şifre"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    showPassword={showRegisterPassword}
                    setShowPassword={setShowRegisterPassword}
                  />

                  <PasswordInput
                    id="register-confirm-password"
                    name="register-confirm-password"
                    label="Şifre Tekrarı"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    showPassword={showRegisterConfirmPassword}
                    setShowPassword={setShowRegisterConfirmPassword}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doğum Tarihi
                    </label>
                    <input
                      type="date"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={registerData.birthDate}
                      onChange={(e) => setRegisterData({...registerData, birthDate: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Kayıt Ol'
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AuthPage; 