
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HeaderComponent = () =>{
    const { currentUser, token, logout, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        console.log('Logout');
        navigate('/');
      }
    return (
        <div>
            <div className="h-14 bg-yellow-200">ヘッダー</div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default HeaderComponent