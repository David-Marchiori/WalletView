import { useState } from 'react';
import api from '../services/api';

type CategoryModalProps = {
  onClose: () => void;
};

export default function CategoryModal({ onClose }: CategoryModalProps) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
    });

    function resetForm() {
        setForm({ name: '', description: '' });
    };

    async function handleSubmit() {
        if (!form.name.trim()) {
            alert('Nome é obrigatório');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/category', form);
            console.log('Sucesso:', response.data);
            resetForm();
            onClose(); 
        } catch (e) {
            alert('Erro ao criar categoria');
            console.error('Erro:', e);
        } finally {
            setLoading(false);
        };

    }

    return (
        <div className="modal">
            <div className="modal-content">
                <button type="button" className="modal-close" onClick={onClose}>✕</button>
                <h2 className="modal-title">Nova Categoria</h2>
                <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <label>
                        Nome
                        <input
                            type="text"
                            placeholder="Ex: Alimentação"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </label>
                    <label>
                        Descrição
                        <input
                            type="text"
                            placeholder="Opcional"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </label>
                    <button type="submit" className="modal-submit" disabled={loading}>
                        {loading ? 'Enviando...' : 'Salvar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
