import { createContext, useContext, useEffect, useState } from 'react';
const API_URL = 'http://localhost:3000/api/v1';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get('token');

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem('authToken', tokenFromUrl);
    } else {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/users/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.json()) // 必要に応じてJSONをパース
      .then((data) => setCurrentUser(data.user))
      .catch((error) => {
        console.error("Error fetching current user", error);
        logout();
      });
    }
  }, [token]);

  const logout = () => {
    setCurrentUser(null);
    setToken("");
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, logout, setToken, currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
