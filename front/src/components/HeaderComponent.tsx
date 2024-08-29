import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCsrf } from "../hooks/useCsrf";
import { useExportCsv } from "../hooks/useExportCsv";

const API_URL = "http://localhost:3000/api/v1";

interface Props {
  role: string;
}

// function ChangeRole(token, currentUser) {
//   console.log("ChangeRoleが呼び出しOK");
//   if (token) {
//     fetch(`${API_URL}/users/change_role/${currentUser.id}`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "X-CSRF-Token": csrfToken,
//         "Content-Type": "application/json",
//       },
//     }).catch((error) => {
//       console.error("Error fetching current user", error);
//     });
//   }
// }

const HeaderComponent = ({ role }) => {
  const { currentUser, token, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { csrfToken } = useCsrf();
  const {exportCsv} = useExportCsv();

  const handleLogout = () => {
    logout();
    console.log("Logout");
    navigate("/");
  };

  const handleChangeRole = (token, currentUser) => {
    // ChangeRole(token, currentUser);
    if (token) {
      fetch(`${API_URL}/users/change_role/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Error fetching current user", error);
      });
    }
    window.location.reload();
  };

  return (
    <div className="w-full h-14 border-gray-200 flex-none flex items-center relative bg-gray-300">
      <button onClick={() => handleChangeRole(token, currentUser)}>
        切り替え
      </button>
      {currentUser.role}
      <div className="mx-3 flex">
        <div className="text-4xl font-bold">BIG STAR</div>
      </div>
      <div className="absolute right-0 flex items-center mx-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-300 mr-3">
          {!currentUser.profile ? (
            <svg
              className="h-1/2 w-1/2 text-secondary-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h1 1 14H20z"></path>
            </svg>
          ) : (
            <img
              src={currentUser.profile}
              alt="profile"
              className="h-full w-full object-cover"
            />
          )}
            <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h1 1 14H20z"></path>
        </div>
        <div>{currentUser.name}</div>
        <button onClick={handleLogout} className="mx-3">
          Logout
        </button>
        <button className="bg-gray-300" onClick={exportCsv}>
          <svg class="w-6 h-6 text-gray-800 dark:text-white bg-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"/>
          </svg>

        </button>
      </div>
    </div>
  );
};

export default HeaderComponent;
