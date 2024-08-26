import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import SideBar from '../components/SideBarComponent';
import SpendRequestForm from '../components/SpendRequestFormComponent';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export const ContentsPage = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  
  if (!currentUser) {
    navigate('/');
  }
  else if(currentUser.role=='auth'){
    // authの時のコンポーネント
    console.log(currentUser.role)
    return (
      <div>権限がauthの時</div>
    );
  }
  else {
    // userの時の
    return (
      
      <div className="w-screen h-screen flex flex-col">
        <HeaderComponent />
        <div className="flex flex-grow">
          <SideBar />
          <div className="flex-grow">
            <SpendRequestForm />
          </div>
        </div>
      </div>
    );
  }
};

export default ContentsPage;
