
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

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

const UpdateSpendRequestFormComponent = (spend_requests:SpendRequest, spendRequestId:string) => {
    const { currentUser, token } = useAuth();
    const API_URL = "http://localhost:3000/api/v1";
    // const [selectedRequest, setSelectedRequest] = useState<SpendRequest | null>(null);
    const [spendRequest, setSpendRequest] = useState<SpendRequest>(spend_requests.spend_requests);
    console.log(spendRequest);


    useEffect(() => {
        // console.log(spend_requests);
        // console.log(spendRequestId)
        console.log(spend_requests)
        setSpendRequest(spend_requests.spend_requests);
        console.log(spendRequest);
    }, [spend_requests]);

    const handleTopLevelChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSpendRequest(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const values = [...spendRequest.spend_request_item];
        values[index][event.target.name as keyof SpendRequestItem] = event.target.value;
        setSpendRequest({ ...spendRequest, spend_request_item: values });
    };

    const handleAddItem = () => {
        setSpendRequest({
            ...spendRequest,
            spend_request_item: [...spendRequest.spend_request_item, {
                date_of_use: "",
                amount: null,
                keihi_class: "",
                invoice_number: null,
                contact_number: null,
                memo: "",
                image_save: null
            }]
        });
    };

    const handleRemoveItem = (index: number) => {
        const values = [...spendRequest.spend_request_item];
        if (values.length > 1) {
            values.splice(index, 1);
            setSpendRequest({ ...spendRequest, spend_request_item: values });
        } else {
            alert("At least one item is required.");
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const payload = { spend_request: spendRequest };
        console.log(payload);

        await fetch(`${API_URL}/keihi/update/${spendRequest.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        window.location.reload();
    };
    // if (!selectedRequest) return <div>Loading...</div>;


    return (
        
        <form method="POST" onSubmit={handleSubmit} className="w-full h-full">
            <div className="w-full h-full flex flex-col">
            <div className="h-14 flex items-center text-3xl my-3 px-3 ">
                編集
            </div>

                <div className="w-full h-full flex-grow overflow-auto px-3">
                    <div className="w-full h-full">
                        <div className="w-full h-fit flex">
                            <div className="w-1/2">
                            {console.log("UpdateSpendRequestFormComponent")}
                                <input type="file" name="image_save" accept="image/jpg, image/png" onChange={(e) => handleInputChange(0, e as ChangeEvent<HTMLInputElement>)} />
                            </div>
                            <div className="w-1/2">
                                <label className="mb-2 text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
                                <input type="text" name="purpose" className="mt-1 inputcss" required onChange={handleTopLevelChange} value={spendRequest.purpose}/>

                                <label className="my-2 text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
                                <input type="text" name="spend_to" className="mt-1 inputcss" required onChange={handleTopLevelChange} value={spendRequest.spend_to}/>

                            {spendRequest.spend_request_item.map((item, index) => (
                                <>
                                <div key={index} className="flex flex-col mx-auto">
                                    <label className="my-2 text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                                    <input type="date" name="date_of_use" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} value={item.date_of_use}/>

                                    <label className="my-2 text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                                    <input type="number" name="amount" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} value={item.amount}/>


                                    <label className="my-2 text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                                    <input type="text" name="keihi_class" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} value={item.keihi_class}/>

                                    <label className="my-2 text-xl block text-gray-800">適格請求書番号</label>
                                    <input type="number" name="invoice_number" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} value={item.invoice_number}/>

                                    <label className="my-2 text-xl block text-gray-800">連絡請求番号</label>
                                    <input type="number" name="contact_number" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} value={item.contact_number}/>

                                    <label className="my-2 text-xl block text-gray-800">メモ</label>
                                    <textarea name="memo" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} value={item.memo}/>
                                </div>
                                <button type="button" className="w-full px-4 rounded bg-white" onClick={() => handleRemoveItem(index)}>

                                <svg class="w-6 h-6 text-gray-800 dark:text-white mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>

                                </button>
                                </>
                            ))}
                            
                            </div>                    
                        </div>
                        <button type="button" className="bg-white py-2 px-4 rounded w-full" onClick={handleAddItem}>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                        </button>
                        
                    </div>
                </div>
                <div className="h-12 w-full flex-none">
                    <button className=" w-full bg-green-500 text-white rounded" type="submit">変更</button>
                </div>
                
            </div>

        </form>
    )
}

export default UpdateSpendRequestFormComponent;
