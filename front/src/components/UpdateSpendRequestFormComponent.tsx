
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
                amount: 0,
                keihi_class: "",
                invoice_number: null,
                contact_number: 0,
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
        <form method="POST" onSubmit={handleSubmit} className="w-full h-full flex">
            <div className="w-1/2 p-4">
                <input type="file" name="image_save" accept="image/jpg, image/png" onChange={(e) => handleInputChange(0, e as ChangeEvent<HTMLInputElement>)} />
            </div>
            <div className="flex w-1/2 flex-col">
                <div className="mx-auto w-full p-3">
                    <label className="my-2 text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
                    <input type="text" name="purpose" className="mt-1 inputcss" required onChange={handleTopLevelChange} value={spendRequest.purpose}/>

                    <label className="my-2 text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
                    <input type="text" name="spend_to" className="mt-1 inputcss" required onChange={handleTopLevelChange} value={spendRequest.spend_to}/>

                    {spendRequest.spend_request_item.map((item, index) => (
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

                            <button type="button" className="bg-red-500 text-white py-2 px-4 rounded my-5" onClick={() => handleRemoveItem(index)}>この項目を削除</button>
                        </div>
                    ))}

                </div>
                <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleAddItem}>項目追加</button>
                <button className="bg-green-500 text-white py-2 px-4 rounded" type="submit">送信</button>
            </div>
        </form>
    )
}

export default UpdateSpendRequestFormComponent;
