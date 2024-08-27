import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import SideBar from "../components/SideBarComponent";
import SpendRequestForm from "../components/SpendRequestFormComponent";
import CheckRequestForm from "../components/CheckRequestFormComponent";
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
      let end_path: string = "";

      if (currentUser.role == "auth") {
        end_path = "index";
      } else {
        end_path = `get_by_user?user_id=${currentUser.id}`;
      }

      console.log(end_path);
      fetch(`${API_URL}/keihi/${end_path}`, {
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
    return (
      <div className="w-screen h-screen flex flex-col">
        <p>authです</p>
        <HeaderComponent role={currentUser.role} />
        <div className="flex flex-grow">
          {/* サイドバーにkeihiのpropsを渡す */}
          <SideBar keihis={keihis} />
          <div className="flex-grow">
            <CheckRequestForm />
          </div>
        </div>
      </div>
    );
  } else {
    // userの時の
    return (
      <div className="w-screen h-screen flex flex-col">
        <HeaderComponent role={currentUser.role} />
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
