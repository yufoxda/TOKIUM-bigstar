import { useEffect, useState } from "react";
import CreateSpendRequestFormComponent from "../components/CreateSpendRequestFormComponent";
import SideBar from "../components/SideBarComponent";
import UpdateSpendRequestFormComponent from "../components/UpdateSpendRequestFormComponent";
import { useAuth } from "../hooks/useAuth";

const API_URL = "http://localhost:3000/api/v1";

interface SpendRequestItem {
    date_of_use: string,
    amount: number,
    keihi_class: string,
    invoice_number: number | null,
    contact_number: number,
    memo: string,
    image_save: any
}

interface SpendRequest {
    user_id: string,
    status: string,
    spend_to: string,
    purpose: string,
    spend_request_item: SpendRequestItem[]
}

const SpendRequestFormContainer = () => {
    const [isCreate, setIsCreate] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [detailId, setDetailId] = useState<string>(null);
    const { currentUser, token } = useAuth();

    const [spendRequests, setSpendRequests] = useState<SpendRequest[]>([]);

    const handleSidebarButton = (id: string) => {
        // console.log(id);
        setDetailId(id);
        console.log(id)
        console.log(detailId);
    }

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
                .then((response) => response.json())
                .then((data) => {
                    setSpendRequests(data);
                })
                .catch((error) => {
                    console.error("Error fetching current user", error);
                });
        }
    }, []);



    return (
        <div className="flex-1 flex min-h-0 overflow-auto h-screen">
            <SideBar className="flex h-full" keihis={spendRequests} setIs_create={setIsCreate} setdetail_id={setDetailId} onButtonClick={handleSidebarButton} />
            <div className="flex-grow p-4 h-screen">
                {isCreate ? (<CreateSpendRequestFormComponent />): <UpdateSpendRequestFormComponent spend_requests={spendRequests.find((request) => request.id === detailId)} spendRequestId={detailId} />}
            </div>
            
        </div>
    )
}

export default SpendRequestFormContainer;