// import useNavigate from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ContentsPage = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log('Logout');
    navigate('/');
  }

  if (!currentUser) {
    navigate('/');
  }else{
    return (
      <div>
        <h1>ContentsPage</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }
};
export default ContentsPage;
