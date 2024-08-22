// import useNavigate from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ContentsPage = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    console.log('Logout');
    navigate('/');
  }
  return (
    <div>
      <h1>ContentsPage</h1>
    </div>
  );
};
export default ContentsPage;
