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

// Item unificado para exibir na lista
type Transaction = TransactionItem & {
  type: 'income' | 'expense';
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function formatMoney(value: number) {
  return value.toFixed(2);
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          api.get<Summary>('/summary'),
          api.get<TransactionsResponse>('/Summary/list'),
        ]);

        setSummary(summaryRes.data);

        // Junta entradas e saídas em uma lista só, ordenada por data (mais recente primeiro)
        const { incomesList, expensesList } = transactionsRes.data;
        const list: Transaction[] = [
          ...incomesList.map((item) => ({ ...item, type: 'income' as const })),
          ...expensesList.map((item) => ({ ...item, type: 'expense' as const })),
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(list);
      } catch (e) {
        console.error('Erro ao buscar dados:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="dashboard-loading">Carregando...</p>;

  return (
    <div className="dashboard">
      {/* Cabeçalho com ações */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-actions">
          <button
            type="button"
            className={showModal ? 'active' : ''}
            onClick={() => setShowModal(true)}
          >
            Nova Transação
          </button>
          <Link to="/categories" className="categories-btn">
            Categorias
          </Link>
        </div>
      </header>

      {/* Resumo financeiro */}
      <section className="summary-cards" aria-label="Resumo financeiro">
        <div className="card card-income">
          <h3>Entradas</h3>
          <p>R$ {formatMoney(summary.totalIncome)}</p>
        </div>

        <div className="card card-expense">
          <h3>Gastos</h3>
          <p>R$ {formatMoney(summary.totalExpenses)}</p>
        </div>

        <div className="card card-balance">
          <h3>Total</h3>
          <p>R$ {formatMoney(summary.balance)}</p>
        </div>
      </section>

      {/* Listagem de transações */}
      <section className="transactions" aria-label="Transações">
        <h2 className="transactions-title">Transações</h2>

        {transactions.length === 0 ? (
          <p className="transactions-empty">Nenhuma transação ainda.</p>
        ) : (
          <ul className="transactions-list">
            {transactions.map((transaction) => (
              <li
                key={`${transaction.type}-${transaction.id}`}
                className={`transaction-item transaction-${transaction.type}`}
              >
                <div className="transaction-info">
                  <span className="transaction-description">
                    {transaction.description}
                  </span>
                  <span className="transaction-date">
                    {formatDate(transaction.date)}
                  </span>
                </div>
                <span className="transaction-amount">
                  {transaction.type === 'income' ? '+' : '-'} R${' '}
                  {formatMoney(transaction.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showModal && (
        <NewTransactionModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
