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

// Item vindo da API (income ou expense)
type TransactionItem = {
  id: number;
  description: string;
  amount: number;
  date: string;
};

// Resposta do endpoint /Summary/list
type TransactionsResponse = {
  incomesList: TransactionItem[];
  expensesList: TransactionItem[];
};

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [incomesList, setIncomesList] = useState<TransactionItem[]>([]);
  const [expensesList, setExpensesList] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca o resumo e as duas listagens ao mesmo tempo
        const [summaryRes, listRes] = await Promise.all([
          api.get<Summary>('/summary'),
          api.get<TransactionsResponse>('/Summary/list'),
        ]);

        setSummary(summaryRes.data);
        setIncomesList(listRes.data.incomesList);
        setExpensesList(listRes.data.expensesList);
      } catch (e) {
        console.error('Erro ao buscar dados:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleDeleteExpense(id: number) {
    try {
      await api.delete(`/Expense/${id}`);
      setExpensesList(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error('Erro ao deletar despesa:', e);
    }
  }

  async function handleDeleteIncome(id: number) {
    try {
      await api.delete(`/Income/${id}`);
      setIncomesList(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error('Erro ao deletar entrada:', e);
    }
  }

  async function handleExportCsv() {
    try {
      const response = await api.get('/Data/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `walletview_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Erro ao gerar CSV:', e);
      alert('Erro ao gerar CSV');
    }
  }

  async function handleDeleteAll() {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir todas as entradas e gastos? Essa ação não pode ser desfeita.'
    );
    if (!confirmed) return;

    try {
      await api.delete('/Data/all');
      setIncomesList([]);
      setExpensesList([]);
      setSummary({ totalIncome: 0, totalExpenses: 0, balance: 0 });
    } catch (e) {
      console.error('Erro ao excluir tudo:', e);
      alert('Erro ao excluir tudo');
    }
  }

  if (loading) return <p className="dashboard-loading">Carregando...</p>;
  if (!summary) return <p className="dashboard-loading">Erro ao carregar dados.</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="dashboard-brand">WalletView</span>
        <h1 className="dashboard-title">Resumo financeiro</h1>
      </header>

      <section className="summary-cards">
        <div className="card card-income">
          <h3>Entradas</h3>
          <p>R$ {summary.totalIncome.toFixed(2)}</p>
        </div>

        <div className="card card-expense">
          <h3>Gastos</h3>
          <p>R$ {summary.totalExpenses.toFixed(2)}</p>
        </div>

        <div className="card card-balance">
          <h3>Total</h3>
          <p>R$ {summary.balance.toFixed(2)}</p>
        </div>
      </section>

      <div className="dashboard-actions">
        <button
          type="button"
          className={showModal ? 'btn-primary active' : 'btn-primary'}
          onClick={() => setShowModal(true)}
        >
          Nova Transação
        </button>
        <Link to="/categories" className="categories-btn">
          Categorias
        </Link>
        <button type="button" className="btn-export" onClick={handleExportCsv}>
          Exportar CSV
        </button>
        <button type="button" className="btn-danger" onClick={handleDeleteAll}>
          Excluir Tudo
        </button>
      </div>

      {/* Listagens de entradas e saídas */}
      <div className="lists-grid">
        <section className="transactions-panel">
          <h2 className="transactions-title">Entradas</h2>
          {incomesList.length === 0 ? (
            <p className="transactions-empty">Nenhuma entrada ainda.</p>
          ) : (
            <ul className="transactions-list">
              {incomesList.map((item) => (
                <li key={item.id} className="transaction-item transaction-income">
                  <div className="transaction-info">
                    <span className="transaction-description">{item.description}</span>
                    <span className="transaction-date">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="transaction-btn-trash">
                      <button type="button" className="btn-trash" onClick={() => handleDeleteIncome(item.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </span>
                  </div>
                  <span className="transaction-amount">
                    + R$ {item.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="transactions-panel">
          <h2 className="transactions-title">Gastos</h2>
          {expensesList.length === 0 ? (
            <p className="transactions-empty">Nenhum gasto ainda.</p>
          ) : (
            <ul className="transactions-list">
              {expensesList.map((item) => (
                <li key={item.id} className="transaction-item transaction-expense">
                  <div className="transaction-info">
                    <span className="transaction-description">{item.description}</span>
                    <span className="transaction-date">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                    {/* <span className="transaction-category">{item.category}</span> */}
                    <span className="transaction-btn-trash">
                      <button type="button" className="btn-trash" onClick={() => handleDeleteExpense(item.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </span>
                  </div>
                  <span className="transaction-amount">
                    - R$ {item.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showModal && (
        <NewTransactionModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
