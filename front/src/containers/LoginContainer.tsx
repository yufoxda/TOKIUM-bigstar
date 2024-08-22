import React from 'react';
import LoginComponent from '../components/LoginComponent';
import { useAuth } from '../hooks/useAuth';

const LoginContainer: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (email: string, password: string) => {
    login(email, password);
  };

  return <LoginComponent onLogin={handleLogin} />;
};

export default LoginContainer;
