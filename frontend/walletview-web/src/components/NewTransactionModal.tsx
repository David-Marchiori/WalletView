import { useEffect, useState } from 'react';
import api from '../services/api';
import './NewTransactionModal.css';

type TransactionTab = 'income' | 'expense';

type NewTransactionModalProps = {
  onClose: () => void;
};

type Category = {
  id: number;
  name: string;
};

export default function NewTransactionModal( { onClose }: NewTransactionModalProps) {
  const [activeTab, setActiveTab] = useState<TransactionTab>('income');
  const [loading, setLoading] = useState(false);
   const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    description: '',
    amount: 0,
    date: '',
    categoryId: '',
  });

  function resetForm() {
    setForm({ description: '', amount: 0, date: '', categoryId: '' });
  }

  useEffect(() => {
      async function fetchCategories() {
        try {
          const response = await api.get('/category');
          setCategories(response.data);
        } catch (e) {
          console.error('Erro ao buscar categorias:', e);
        }
      }

      fetchCategories();
    }, []);

  function handleTabChange(tab: TransactionTab) {
    setActiveTab(tab);
    resetForm();
  }

  async function handleSubmit() {
    if (activeTab === 'expense' && !form.categoryId) {
      alert('Categoria é obrigatória para despesas');
      return;
    }

  if (!form.description.trim()) {
    alert('Descrição é obrigatória');
    return;
  }

    if (form.amount <= 0) {
    alert('Valor deve ser maior que zero');
    return;
  }

  if (!form.date) {
    alert('Data é obrigatória');
    return;
  }
  
    setLoading(true);

    const endpoint = activeTab === 'income' ? '/income' : '/expense';

    try {
      const response = await api.post(endpoint, form);
      console.log('Sucesso:', response.data);
      resetForm();
    } catch (e) {
      alert('Erro ao enviar');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
  <button onClick={onClose}>X</button>
        {/* Abas */}
        <div className="modal-tabs">
          <button
            className={activeTab === 'income' ? 'active' : ''}
            onClick={() => handleTabChange('income')}
          >
            Entrada
          </button>
          <button
            className={activeTab === 'expense' ? 'active' : ''}
            onClick={() => handleTabChange('expense')}
          >
            Saída
          </button>
        </div>

        {/* Formulário (mesmo JSX serve pras duas abas) */}
        <div className="modal-form">
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descrição"
          />
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            placeholder="Valor"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
         {activeTab === 'expense' && (
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : 'Salvar'}
          </button>
        </div>

      </div>
    </div>
  );
}