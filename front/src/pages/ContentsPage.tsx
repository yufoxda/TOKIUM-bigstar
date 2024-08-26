import { useNavigate } from 'react-router-dom';
import CalenderEventsComponent from '../components/CalenderEventsComponent';
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
        <CalenderEventsComponent userId={currentUser.id} token={token} />
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
