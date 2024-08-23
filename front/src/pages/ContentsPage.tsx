import react from 'react';
import SideBar from '../components/SideBarComponent';
import SpendRequestForm from '../components/SpendRequestFormComponent';
import HeaderComponent from '../components/HeaderComponent';

const ContentsPage = () => {
  return (
    <div className="w-screen">
      <HeaderComponent/>
      <div className="flex h-screen">
        <SideBar/>
        <SpendRequestForm/>
      </div>  
    </div>

    
  );
};

export default ContentsPage;