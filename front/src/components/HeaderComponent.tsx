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
      <div className="mx-3 flex">
        <div className="text-4xl font-bold">BIG STAR</div>
      </div>
      <button onClick={() => handleChangeRole(token, currentUser)} className="mx-auto rounded p-1.5">
        now: {currentUser.role}
      </button>
      <div className="absolute right-0 flex items-center p-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-200">
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
              className="h-full w-full object-cover sm:hidden"
            />
          )}
            <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h1 1 14H20z"></path>
        </div>
        <div className="mx-3 h-13">{currentUser.name}</div>
        <button onClick={handleLogout} className="rounded p-1.5">
          Logout
        </button>
      </div>
    </div>
  );
};

export default HeaderComponent;
