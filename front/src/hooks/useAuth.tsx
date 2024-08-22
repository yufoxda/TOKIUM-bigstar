import { useState, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        user: {
          email,
          password,
        },
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, error: 'Login failed' };
    }
    return { success: false };
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3000/ap1/v1/logout');
      if (response.status === 200) {
        setIsAuthenticated(false);
        return { success: true };
      }
    } catch (error) {
      console.error('Logout failed', error);
      return { success: false, error: 'Logout failed' };
    }
    return { success: false };
  }, []);

  return { isAuthenticated, login, logout };
};
