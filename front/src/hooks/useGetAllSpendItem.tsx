import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const API_URL = "http://localhost:3000/api/v1";

interface SpendRequestItem {
    id: string;
    date_of_use: string;
    amount: number;
    keihi_class: string;
    invoice_number: number | null;
    contact_number: number;
    memo: string;
    image_save: File | null;
}
interface SpendRequest {
    user_id: string;
    status: string;
    spend_to: string;
    purpose: string;
    spend_request_item: SpendRequestItem[];
}

export const useGetAllSpendItem = () => {
    const [spend, setSpend] = useState<SpendRequest[]>([]);
    const { currentUser, token, logout } = useAuth();

    if (currentUser.role !== 'auth'){
        alert("権限がありません");
        return;
    }
    useEffect(() => {
        axios.get(`${API_URL}/keihi/index`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': '',
            },
        })
            .then((response) => {
                setSpend(response.data);
            })
            .catch((error) => {
                console.error("Error fetching spend items", error);
            });
    }, [])
    return { spend };
}
