import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import SideBar from "../components/SideBarComponent";
import SpendRequestForm from "../components/SpendRequestFormComponent";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export const ContentsPage = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [keihis, setKeihis] = useState<any[]>([]);

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
        <div className="flex flex-grow">
          {/* サイドバーにkeihiのpropsを渡す */}
          <SideBar keihis={keihis} />
          <div className="flex-grow">
            <SpendRequestForm />
          </div>
        </div>
      </div>
    );
  }
};

export default ContentsPage;
