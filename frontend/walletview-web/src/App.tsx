import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
