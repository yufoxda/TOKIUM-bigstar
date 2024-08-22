import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginComponent from '../components/LoginComponent';

const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      navigate('/contents');  // ログイン成功時に/contentsへリダイレクト
    } else {
      setError(result.error || 'Login failed');
      navigate('/login');  // ログイン失敗時に/loginへリダイレクト
    }
  };

  return <LoginComponent onLogin={handleLogin} error={error} />;
};

export default LoginContainer;
