import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export const useGetSpendItem = (id: string | null) => {
  const [spend, setSpend] = useState<any>(null);
  const [loading_spend, setLoading] = useState<boolean>(true); // loading_spend に名前変更
  const [error_spend, setError] = useState<string | null>(null); // error_spend に名前変更

  useEffect(() => {
    const fetchSpend = async () => {
      try {
        const response = await axios.get(`${API_URL}/keihi/show/${id}`);
        setSpend(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpend();
    } else {
      setSpend(null); // Return null if id is not provided
      setLoading(false);
    }
  }, [id]);

  return { spend, loading_spend, error_spend }; // 戻り値に名前変更を反映
};
