// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import FamilyTreeEditor from './components/FamilyTreeEditor';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Navbar />
                  <div className="container mx-auto py-6 px-4">
                    <Dashboard />
                  </div>
                  <Footer />
                </PrivateRoute>
              }
            />
            <Route
              path="/tree/:treeId"
              element={
                <PrivateRoute>
                  <Navbar />
                  <div className="container mx-auto py-6 px-4">
                    <FamilyTreeEditor />
                  </div>
                  <Footer />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;