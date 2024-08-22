import react from 'react';
import SideBar from '../components/SideBarComponent';
import SpendRequestForm from '../components/SpendRequestFormComponent';

const ContentsPage = () => {
  return (
    <div className="flex h-screen">
      <SideBar/>
      <SpendRequestForm/>
    </div>
  );
};

export default ContentsPage;