import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import SideBar from "../components/SideBarComponent";
import SpendRequestForm from "../components/SpendRequestFormComponent";
import { useAuth } from "../hooks/useAuth";
import { useFetchKeihis } from "../hooks/useFetchKeihis";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export const ContentsPage = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [keihis, setKeihis] = useState<any[]>([]);
  const [is_create, setIs_create] = useState<boolean>(true);
  const [detail_id, setdetail_id] = useState<string>(null);
  


  /* ------------------- */
  useEffect(() => {
    console.log(currentUser);
    if (token) {
      fetch(`${API_URL}/keihi/get_by_user?user_id=${currentUser.id}`, {
        method: "GET",
      })
        .then((response) => response.json()) // 必要に応じてJSONをパース
        .then((data) => {
          setKeihis(data);
        })
        .catch((error) => {
          console.error("Error fetching current user", error);
          logout();
        });
    }
  }, []);
  /* ------------------- */

  if (!currentUser) {
    navigate("/");
  } else if (currentUser.role == "auth") {
    // authの時のコンポーネント
    console.log(currentUser.role);
    return <div>権限がauthの時</div>;
  } else {
    // userの時の
    return (

      <div className="w-screen h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex-1 flex min-h-0">
        <SideBar className="h-full" keihis={keihis} setIs_create={setIs_create} setdetail_id={setdetail_id}/>
        <div className="flex-1 h-full overflow-auto">
          <SpendRequestForm className="h-full" is_create={is_create} detail_id={detail_id}/>
        </div>
      </div>
    </div>
    );
  }
};

export default ContentsPage;
