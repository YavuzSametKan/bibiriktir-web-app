import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';
import StatisticsPage from './pages/StatisticsPage';
import GoalsPage from './pages/GoalsPage';
import MonthlyReviewPage from './pages/MonthlyReviewPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { CategoryProvider } from './context/CategoryContext';
import { TransactionProvider } from './context/TransactionContext';
import PageLoader from './components/common/PageLoader';
import { useState, useEffect } from 'react';
import AccountSettingsPage from './pages/AccountSettingsPage';

// Loading bileşeni
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Sayfa geçiş animasyonu için wrapper
function PageTransitionWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Minimum 500ms göster

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <PageLoader isVisible={isLoading} />
      {children}
    </>
  );
}

// Korumalı Route bileşeni
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <PageTransitionWrapper>{children}</PageTransitionWrapper>;
}

// Genel route bileşeni
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Sadece dashboard'a yönlendirme yap, diğer durumlarda sayfayı yenileme
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Ana Layout bileşeni (Navbar ve Footer ile)
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

// Auth Layout bileşeni (Sadece sayfa içeriği)
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}

// 404 Sayfası bileşeni
function NotFoundPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <p className="mt-4 text-gray-600">Aradığınız sayfa bulunamadı.</p>
        </div>
      </div>
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <TransactionProvider>
          <FinanceProvider>
            <Router>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <Routes>
                <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
                <Route path="/statistics" element={<ProtectedRoute><MainLayout><StatisticsPage /></MainLayout></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><MainLayout><GoalsPage /></MainLayout></ProtectedRoute>} />
                <Route path="/monthly-review" element={<ProtectedRoute><MainLayout><MonthlyReviewPage /></MainLayout></ProtectedRoute>} />
                <Route path="/account-settings" element={<ProtectedRoute><MainLayout><AccountSettingsPage /></MainLayout></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </FinanceProvider>
        </TransactionProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
