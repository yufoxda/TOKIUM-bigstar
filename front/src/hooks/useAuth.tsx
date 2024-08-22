import axios from 'axios';
import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        email,
        password,
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
        // 必要に応じてトークンを保存する
        // localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/logout');
      if (response.status === 200) {
        setIsAuthenticated(false);
        // localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return { isAuthenticated, login, logout };
};
