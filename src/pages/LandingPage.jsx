import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  FlagIcon,
  CalendarIcon,
  BellIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Footer from '../components/common/Footer';

function Navbar() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">BiBiriktir</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('why-bibiriktir')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Neden Biriktir?
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Özellikler
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              SSS
            </button>
            <button
              onClick={() => navigate('/auth?segment=login')}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate('/auth?segment=register')}
              className="px-4 py-2 rounded-lg text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow border border-blue-600"
            >
              Hesabınız yok mu?
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function FeatureCard({ icon: Icon, title, description, bgColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-6 rounded-2xl ${bgColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                  <span className="block">Finansal Özgürlük</span>
                  <span className="block text-blue-600">Artık Çok Yakın</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600">
                  Hedeflerinize ulaşmanın en akıllı yolu burada
                </p>
                <p className="text-lg text-gray-500">
                  Biriktir ile finansal hedeflerinizi takip edin, gelişiminizi analiz edin ve aylık değerlendirmelerle kendinizi geliştirin.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={() => navigate('/auth?segment=login')}
                  className="px-8 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => navigate('/auth?segment=register')}
                  className="px-8 py-3 rounded-lg text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow border border-blue-600"
                >
                  Hesabınız yok mu?
                </button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 lg:mt-0 relative"
            >
              <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <SparklesIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Finansal Hedefleriniz</h3>
                    <p className="text-gray-600">Hedeflerinize ulaşmanın en akıllı yolu</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Biriktir Section */}
      <div id="why-bibiriktir" className="py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-blue-100/20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Neden Biriktir?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              Finansal özgürlüğünüze giden yolda size yardımcı olacak özellikler
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={FlagIcon}
              title="Kişisel Hedef Takibi"
              description="Finansal hedeflerinizi belirleyin ve ilerlemenizi takip edin."
              bgColor="bg-gradient-to-br from-blue-50 to-blue-100/50"
            />
            <FeatureCard
              icon={CalendarIcon}
              title="Aylık Gelişim Değerlendirmeleri"
              description="Her ay finansal durumunuzu değerlendirin ve iyileştirmeler yapın."
              bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100/50"
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="İstatistikler ile Görsel Gelişim"
              description="Harcama alışkanlıklarınızı analiz edin, tasarruf fırsatlarını keşfedin."
              bgColor="bg-gradient-to-br from-purple-50 to-purple-100/50"
            />
            <FeatureCard
              icon={BellIcon}
              title="Akıllı Tavsiyeler"
              description="Önemli finansal olaylar için anında bildirimler ve tavsiyeler alın."
              bgColor="bg-gradient-to-br from-pink-50 to-pink-100/50"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/auth?segment=login')}
                className="px-8 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => navigate('/auth?segment=register')}
                className="px-8 py-3 rounded-lg text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow border border-blue-600"
              >
                Hesabınız yok mu?
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Özellikler
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              Finansal hedeflerinize ulaşmanızı sağlayacak güçlü özellikler
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={BanknotesIcon}
              title="Birikim Hedefi Oluşturma"
              description="Hayalinizdeki hedefler için birikim planları oluşturun ve ilerlemenizi takip edin."
              bgColor="bg-gradient-to-br from-blue-50 to-blue-100/50"
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="Otomatik Bütçe Takibi"
              description="Gelir ve giderlerinizi otomatik olarak kategorize edin ve bütçenizi yönetin."
              bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100/50"
            />
            <FeatureCard
              icon={ArrowTrendingUpIcon}
              title="Detaylı Finansal Raporlar"
              description="Harcama alışkanlıklarınızı analiz edin ve tasarruf fırsatlarını keşfedin."
              bgColor="bg-gradient-to-br from-purple-50 to-purple-100/50"
            />
            <FeatureCard
              icon={DevicePhoneMobileIcon}
              title="Mobil Uyumluluk"
              description="İstediğiniz cihazdan erişin ve finansal durumunuzu her an takip edin."
              bgColor="bg-gradient-to-br from-pink-50 to-pink-100/50"
            />
            <FeatureCard
              icon={BellIcon}
              title="Akıllı Bildirimler"
              description="Önemli finansal olaylar için anında bildirimler alın."
              bgColor="bg-gradient-to-br from-green-50 to-green-100/50"
            />
            <FeatureCard
              icon={ShieldCheckIcon}
              title="Güvenli Altyapı"
              description="Verileriniz güvende, end-to-end şifreleme ile korunuyor."
              bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100/50"
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Sıkça Sorulan Sorular
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              Merak ettiğiniz soruların cevapları
            </motion.p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Biriktir nasıl çalışır?"
              answer="Biriktir, finansal hedeflerinizi belirlemenize, birikimlerinizi takip etmenize ve finansal durumunuzu analiz etmenize yardımcı olan bir platformdur. Gelir ve giderlerinizi kaydedebilir, hedefler belirleyebilir ve ilerlemenizi takip edebilirsiniz."
            />
            <FAQItem
              question="Ücretlendirme nasıl?"
              answer="Şu anda Biriktir tamamen ücretsizdir. Gelecekte premium özellikler eklenebilir, ancak temel özellikler her zaman ücretsiz kalacaktır."
            />
            <FAQItem
              question="Verilerim güvende mi?"
              answer="Evet, verileriniz end-to-end şifreleme ile korunmaktadır. Banka düzeyinde güvenlik önlemleri kullanıyoruz ve verileriniz asla üçüncü taraflarla paylaşılmaz."
            />
            <FAQItem
              question="Nasıl başlayabilirim?"
              answer="Hemen ücretsiz bir hesap oluşturun, ilk hedefinizi belirleyin ve birikimlerinizi takip etmeye başlayın. Size özel bir yol haritası oluşturacağız."
            />
            <FAQItem
              question="Mobil uygulama var mı?"
              answer="Şu anda web uygulaması üzerinden hizmet veriyoruz. Mobil uygulama geliştirme çalışmalarımız devam ediyor ve yakında kullanıma sunulacak."
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage; 