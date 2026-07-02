import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'
import Category from './pages/Category';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute>
              <Category />
            </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
