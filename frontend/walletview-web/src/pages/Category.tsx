import { useEffect, useState } from 'react';
// Link: componente do React Router que navega entre páginas sem recarregar o site
import { Link } from 'react-router-dom';
import CategoryModal from '../components/CategoryModal';
import api from '../services/api';

export default function Category() {
    const [loading, setLoading] = useState(true);
    const [listCategories, setListCategories] = useState([]);
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
    async function fetchCategories() {
        setLoading(true);
        try {
            const response = await api.get('/category');
            setListCategories(response.data);
        } catch (e) {
            alert('Erro ao buscar categorias');
            console.error('Erro:', e);
        } finally {
            setLoading(false);
        }
    } 
 fetchCategories();
}, []);

return (
    <div className="category-page">
        <div className="list-categories">
            {/* to="/dashboard" define para qual rota o usuário será levado ao clicar */}
            <Link to="/dashboard" className="back-btn">
                ← Voltar ao Dashboard
            </Link>

            <header className="category-header">
                <span className="category-brand">WalletView</span>
                <h2>Categorias</h2>
                <p className="category-subtitle">Organize seus gastos por tipo</p>
            </header>

            {loading ? (
                <p className="category-loading">Carregando...</p>
            ) : (
                <ul className="categories-list">
                    {listCategories.map((category: any) => (
                        <li key={category.id} className="category-item">
                            {category.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <button type="button" className="new-category-btn" onClick={() => setShowModal(true)}>
            Nova Categoria
        </button>

        {showModal && (
            <CategoryModal onClose={() => setShowModal(false)} />
        )}
    </div>
);

}
