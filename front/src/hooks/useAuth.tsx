import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useCsrf } from './useCsrf';

const API_URL = 'http://localhost:3000/api/v1';

// AuthContextの型定義
interface AuthContextType {
  token: string;
  logout: () => void;
  setToken: (token: string) => void;
  currentUser: any; // 型を適切に設定するべきですが、暫定的に any を使用しています
  setCurrentUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { csrfToken } = useCsrf();

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
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json()) // 必要に応じてJSONをパース
      .then((data) => setCurrentUser(data.user))
      .catch((error) => {
        console.error("Error fetching current user", error);
        logout();
      });
    }
  }, [token, csrfToken]);

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
};
