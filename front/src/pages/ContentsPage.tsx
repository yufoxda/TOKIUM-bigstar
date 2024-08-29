import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthTableComponent from "../components/AuthTableComponent";
import HeaderComponent from "../components/HeaderComponent";
import SpendRequestFormContainer from "../containers/SpendRequestFormContainer";
import { useAuth } from "../hooks/useAuth";

const API_URL = "http://localhost:3000/api/v1";

export const ContentsPage = () => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [keihis, setKeihis] = useState<any[]>([]);
  const [is_create, setIs_create] = useState<boolean>(true);
  const [detail_id, setdetail_id] = useState<string>(null);



  /* ------------------- */
  useEffect(() => {
    if (token) {
      let end_path: string = "";

      if (currentUser.role == "auth") {
        end_path = "index";
      } else {
        end_path = `get_by_user?user_id=${currentUser.id}`;
      }

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
        <HeaderComponent role={currentUser.role} />
        <div className="flex flex-grow">
          {/* サイドバーにkeihiのpropsを渡す */}
          {/* <SideBar className="h-full" keihis={keihis} setIs_create={setIs_create} setdetail_id={setdetail_id}/> */}
          {/* <div className="flex-grow">
            <CheckRequestForm className="h-full" is_create={is_create} detail_id={detail_id}/>
          </div> */}
          <AuthTableComponent />
        </div>
      </div>
    );
  } else {
    // userの時の
    return (

      <div className="w-screen h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex-1 flex min-h-0">
        {/* <SideBar className="h-full" keihis={keihis} setIs_create={setIs_create} setdetail_id={setdetail_id}/> */}
    
          {/* <SpendRequestForm className="h-full" is_create={is_create} detail_id={detail_id}/> */}
          <SpendRequestFormContainer className="h-full" />
   
      </div>
    </div>
    );
  }
};

export default ContentsPage;
