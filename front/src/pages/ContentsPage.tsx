import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import SideBar from '../components/SideBarComponent';
import SpendRequestForm from '../components/SpendRequestFormComponent';
import { useAuth } from '../hooks/useAuth';

export const ContentsPage = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/');
  } else {
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
