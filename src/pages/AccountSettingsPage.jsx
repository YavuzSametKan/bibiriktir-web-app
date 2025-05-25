import { useState, Fragment } from 'react';
import { UserCircleIcon, KeyIcon, CalendarIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function AccountSettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isTFAModalOpen, setIsTFAModalOpen] = useState(false);
  const [tfaCode, setTFACode] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isButtonLocked, setIsButtonLocked] = useState(false);
  const [generalTimer, setGeneralTimer] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    birthDate: user?.birthDate || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validatePassword = () => {
    const errors = {};
    
    if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Şifre en az 8 karakter olmalıdır';
    }
    
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Şifre en az bir büyük harf içermelidir';
    }
    
    if (!/[a-z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Şifre en az bir küçük harf içermelidir';
    }
    
    if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Şifre en az bir rakam içermelidir';
    }
    
    if (!/[!@#$%^&*]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Şifre en az bir özel karakter içermelidir (!@#$%^&*)';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => {
        toast.error(error);
      });
      return false;
    }
    
    return true;
  };

  const startGeneralTimer = () => {
    setGeneralTimer(180); // 180 saniye
    
    const generalTimerInterval = setInterval(() => {
      setGeneralTimer((prev) => {
        if (prev <= 1) {
          clearInterval(generalTimerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startResendTimer = () => {
    setResendTimer(60); // 60 saniye
    setIsButtonLocked(true);
    
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsButtonLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    if (isButtonLocked || isResending) {
      return;
    }
    
    setIsResending(true);
    try {
      const response = await axios.post('/api/update-password/start', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmPassword
      });

      if (response.data.success) {
        toast.success('Yeni doğrulama kodu gönderildi');
        setTFACode(''); // Yeni kod gönderildiğinde input'u resetle
        startResendTimer(); // Yeni kod gönderildikten sonra timer'ı başlat
        startGeneralTimer(); // Genel sayacı yeniden başlat
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Doğrulama kodu gönderilemedi');
    } finally {
      setIsResending(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı
      setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (!validatePassword()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/update-password/start', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmPassword
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsTFAModalOpen(true);
        // Modal açıldığında sadece resendTimer'ı sıfırla ve genel sayacı başlat
        setResendTimer(0);
        setIsButtonLocked(false);
        startGeneralTimer(); // Genel sayacı başlat
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTFASubmit = async () => {
    if (tfaCode.length !== 6) {
      toast.error('Lütfen 6 haneli kodu giriniz.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/update-password/verify', {
        code: tfaCode
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsTFAModalOpen(false);
        setTFACode('');
        setRemainingAttempts(5); // Başarılı doğrulamada hakları sıfırla
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Doğrulama kodu hatalı';
      toast.error(errorMessage);
      setRemainingAttempts(prev => {
        const newAttempts = prev - 1;
        if (newAttempts <= 0) {
          setIsTFAModalOpen(false);
          setTFACode('');
          toast.error('Maksimum deneme sayısına ulaştınız. Lütfen tekrar deneyin.');
          setTimeout(() => {
            setRemainingAttempts(5); // Modal kapandıktan sonra hakları sıfırla
          }, 100);
        }
        return newAttempts;
      });
      setTFACode(''); // Hatalı kod girildiğinde input'u resetle
    } finally {
      setIsLoading(false);
    }
  };

  // Modal kapatma fonksiyonu
  const handleCloseModal = () => {
    setIsTFAModalOpen(false);
    setTFACode('');
    setRemainingAttempts(5); // Modal manuel kapatıldığında hakları sıfırla
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const maskEmail = (email) => {
    if (!email) return '';
    
    const [username, domain] = email.split('@');
    const [domainName, tld] = domain.split('.');
    
    const maskedUsername = username.slice(0, 4) + '*'.repeat(username.length - 4);
    const maskedDomain = domainName.slice(0, 3) + '*'.repeat(domainName.length - 3);
    
    return `${maskedUsername}@${maskedDomain}.${tld}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Hesap Ayarları</h1>
        <p className="mt-2 text-base text-gray-600">
          Hesap bilgilerinizi ve şifrenizi buradan güncelleyebilirsiniz.
        </p>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-xl ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profil Bilgileri */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl">
                <UserCircleIcon className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Profil Bilgileri</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Doğum Tarihi
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {isLoading ? 'Güncelleniyor...' : 'Profili Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Şifre Güncelleme */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl">
                <KeyIcon className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Şifre Güncelleme</h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Mevcut Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.current ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        validationErrors.newPassword ? 'border-red-300' : 'border-gray-200'
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.new ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre (Tekrar)
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPasswords.confirm ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* TFA Modal */}
      <Transition appear show={isTFAModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      İki Faktörlü Doğrulama
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={handleCloseModal}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Lütfen <span className="font-medium text-gray-700">{maskEmail(user?.email)}</span> adresine gönderilen 6 haneli doğrulama kodunu giriniz.
                    </p>
                    <div className="mt-4">
                      <input
                        type="text"
                        maxLength={6}
                        value={tfaCode}
                        onChange={(e) => setTFACode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="000000"
                      />
                    </div>
                    <div className="mt-4 text-center space-y-2">
                      <p className="text-sm text-gray-600">
                        Kalan deneme hakkı: <span className="font-medium text-indigo-600">{remainingAttempts}</span>
                      </p>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={isButtonLocked || isResending}
                          className={`text-sm text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 ${
                            isButtonLocked ? 'opacity-50' : ''
                          }`}
                        >
                          {isResending ? 'Gönderiliyor...' : 
                           isButtonLocked ? `Tekrar göndermek için ${resendTimer} saniye bekleyin...` : 
                           'Yeni Kod Gönder'}
                        </button>
                        {generalTimer > 0 && (
                          <p className="text-xs text-gray-500">
                            Kodun geçerlilik süresi: {Math.floor(generalTimer / 60)}:{(generalTimer % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
                      onClick={handleCloseModal}
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      disabled={isLoading || tfaCode.length !== 6 || remainingAttempts <= 0}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleTFASubmit}
                    >
                      {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default AccountSettingsPage; 