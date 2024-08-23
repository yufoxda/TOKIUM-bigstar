
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
        <div className="h-14 bg-yellow-200 flex items-center relative sticky top-0">
            <div className="mx-3 flex">
                <div className="border border-black">アプリ名</div>
                
            </div>
            <div className="absolute right-0 flex items-center mx-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-300 mr-3">
                    <svg className="h-1/2 w-1/2 text-secondary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h1 1 14H20z"></path>
                    </svg>
                </div>
                <div>
                    tokium taro
                </div>
                <button onClick={handleLogout} className="mx-3">Logout</button>
            </div>
        </div>
    )
}

export default HeaderComponent