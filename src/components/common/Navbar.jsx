import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, BanknotesIcon, ChartBarIcon, Bars3Icon, HomeIcon, FlagIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Sol taraf - Logo ve Navigasyon */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <BanknotesIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Bibiriktir</span>
            </Link>

            {/* Masaüstü Navigasyon */}
            <nav className="hidden sm:flex items-center gap-4">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  Ana Sayfa
                </div>
              </Link>
              <Link
                to="/statistics"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/statistics'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" />
                  İstatistikler
                </div>
              </Link>
              <Link
                to="/goals"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/goals'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FlagIcon className="h-5 w-5" />
                  Hedefler
                </div>
              </Link>
            </nav>
          </div>

          {/* Sağ taraf - Profil Menüsü ve Mobil Menü Butonu */}
          <div className="flex items-center gap-4">
            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Profil Menüsü */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <UserCircleIcon className="h-6 w-6" />
                <span className="text-sm font-medium">{user?.firstName || 'Kullanıcı'}</span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        Hesap Ayarları
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/monthly-review"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                      >
                        <ChartBarIcon className="h-5 w-5" />
                        Değerlendirmeler
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Çıkış Yap
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-2">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  Ana Sayfa
                </div>
              </Link>
              <Link
                to="/statistics"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/statistics'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" />
                  İstatistikler
                </div>
              </Link>
              <Link
                to="/goals"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/goals'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <FlagIcon className="h-5 w-5" />
                  Hedefler
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 