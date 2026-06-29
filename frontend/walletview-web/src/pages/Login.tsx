import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../services/authService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        }
        catch (err) {
            setError('E-mail ou senha inválidos. Por favor, tente novamente.');
        }
    };

     return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  );
}