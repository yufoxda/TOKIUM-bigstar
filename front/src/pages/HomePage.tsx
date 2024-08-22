import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const HomePage = () => {
  const navigate = useNavigate();
  const { setToken, currentUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      localStorage.setItem('authToken', token);
    }
  }, [setToken, navigate]);

  const handleGoogleAuth = (e) => {
    e.preventDefault()
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = 'http://localhost:3000/auth/google_oauth2/';
    document.body.appendChild(form);
    form.submit();
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="space-y-4">
        {currentUser ? (
          <Link to="/contents" className="btn btn-accent gap-2 w-full">
            Show Contents
          </Link>
        ) : (
          <button onClick={handleGoogleAuth} className="btn btn-accent gap-2 w-full">
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;