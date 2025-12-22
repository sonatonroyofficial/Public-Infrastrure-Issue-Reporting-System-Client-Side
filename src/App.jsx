import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import AllIssues from './pages/AllIssues';
import NotFound from './pages/NotFound';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/issues" element={<AllIssues />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/report-issue"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <ReportIssue />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-issues"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <MyIssues />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
