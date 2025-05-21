import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, BanknotesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <div className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Sol taraf - Logo ve Navigasyon */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <BanknotesIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Bibiriktir</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Ana Sayfa
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
            </nav>
          </div>

          {/* Sağ taraf - Profil Menüsü */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
              <UserCircleIcon className="h-6 w-6" />
              <span className="text-sm font-medium">Test Kullanıcı</span>
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
                    <button
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
    </div>
  );
}

export default Navbar; 