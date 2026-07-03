// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import NewTransactionModal from '../components/NewTransactionModal';
import { Link } from 'react-router-dom';
import api from '../services/api';

type Summary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

export default function Dashboard() {
   const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await api.get('/summary');
        setSummary(response.data);
      } catch (e) {
        console.error('Erro ao buscar resumo:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []); // array vazio = roda só uma vez, igual onMounted

  if (loading) return <p>Carregando...</p>;
  if (!summary) return <p>Erro ao carregar dados.</p>;

  return (
    <div className="dashboard">
      <div className="card">
        <h3>Entradas</h3>
        <p>R$ {summary.totalIncome.toFixed(2)}</p>
      </div>

      <div className="card">
        <h3>Gastos</h3>
        <p>R$ {summary.totalExpenses.toFixed(2)}</p>
      </div>

      <div className="card">
        <h3>Total</h3>
        <p>R$ {summary.balance.toFixed(2)}</p>
      </div>

      <button   className={showModal ? 'active' : ''}
            onClick={() => setShowModal(true)}>
              Nova Transação
            </button>
             {showModal && (
        <NewTransactionModal onClose={() => setShowModal(false)} />
      )}
      <Link to="/categories" className="categories-btn">
  Categorias
</Link>
    </div>
  );
}