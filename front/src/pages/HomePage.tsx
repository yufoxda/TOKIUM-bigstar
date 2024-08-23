import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    form.method = 'POST';
    form.action = 'http://localhost:3000/auth/google_oauth2/';
    document.body.appendChild(form);
    form.submit();
  }
  if (currentUser) {
    navigate('/contents');
  }else{
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="space-y-4">
            <button onClick={handleGoogleAuth} className="btn btn-accent gap-2 w-full">
              Sign in with Google
            </button>

        </div>
      </div>
    );
  }
};

export default HomePage;
