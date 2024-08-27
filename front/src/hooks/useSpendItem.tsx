import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";


const API_URL = "http://localhost:3000/api/v1";

export const useFetchKeihis = () => {
  const { currentUser, token, logout } = useAuth();
  const [keihis, setKeihis] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/keihi/get_by_user?user_id=${currentUser.id}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setKeihis(data);
        })
        .catch((error) => {
          console.error("Error fetching current user", error);
          logout();
        });
    }
  }, [token, currentUser, logout]);

  return { keihis };
};
