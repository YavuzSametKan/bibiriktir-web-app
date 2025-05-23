import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Korumalı Route bileşeni
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <FinanceProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              <Route path="/auth" element={
                <AuthLayout>
                  <AuthPage />
                </AuthLayout>
              } />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/statistics" element={
                <ProtectedRoute>
                  <MainLayout>
                    <StatisticsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/goals" element={
                <ProtectedRoute>
                  <MainLayout>
                    <GoalsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/monthly-review" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MonthlyReviewPage />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* Gelecekte eklenecek korumalı sayfalar için örnek */}
              <Route path="/reports" element={
                <ProtectedRoute>
                  <MainLayout>
                    {/* <ReportsPage /> */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
                      <p className="mt-4 text-gray-600">Bu sayfa yapım aşamasındadır.</p>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* 404 Sayfası */}
              <Route path="*" element={
                <MainLayout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900">404</h1>
                      <p className="mt-4 text-gray-600">Aradığınız sayfa bulunamadı.</p>
                    </div>
                  </div>
                </MainLayout>
              } />
            </Routes>
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
              theme="light"
            />
          </div>
        </FinanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
