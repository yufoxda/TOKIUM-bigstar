import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/v1';

export const useCsrf = () => {
  const [csrfToken, setCsrfToken] = useState('');

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(`${API_URL}/csrf_token`);
      const data = await response.json();
      setCsrfToken(data.csrf_token);
    } catch (error) {
      console.error('Error fetching CSRF token', error);
    }
  }

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return { csrfToken };
};
