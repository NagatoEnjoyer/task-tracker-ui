import { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const endpoint = isLogin ? '/login' : '/register';
        const url = `https://task-tracker-api-ragt.onrender.com/api/auth${endpoint}`; 

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.text();

            if (!response.ok) {
                setMessage(`❌ ${data}`);
                return;
            }

            if (isLogin) {
                localStorage.setItem('jwt_token', data);
                onLoginSuccess();
            } else {
                setMessage('Registered successfully! You can now log in.');
                setIsLogin(true);
            }

        } catch (error) {
            setMessage('Could not connect to the server.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2>{isLogin ? 'Log In' : 'Register'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
            </form>

            {message && <p>{message}</p>}

            <button 
                onClick={() => setIsLogin(!isLogin)} 
                style={{ marginTop: '20px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            >
                {isLogin ? 'Need an account? Register here.' : 'Already have an account? Log in.'}
            </button>
        </div>
    );
}