import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <FinanceProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            {/* Gelecekte eklenecek sayfalar için route'lar buraya eklenecek */}
          </Routes>
        </div>
      </FinanceProvider>
    </Router>
  );
}

export default App;
