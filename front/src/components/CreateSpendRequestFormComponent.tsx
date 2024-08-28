import { ChangeEvent, FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useCalendar from '../hooks/useCalendar';
import formatDateToJapanese from '../utils/formatDate';

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

const CreateSpendRequestFormComponent = () => {
    const { currentUser, token } = useAuth();
    const { events, loading, error } = useCalendar();
    const [isOverlay, setIsOverlay] = useState<boolean>(false);
    const API_URL = "http://localhost:3000/api/v1";

    const showOverlay = () => {
        setIsOverlay(true);
    }
    const hideOverlay = () => {
        setIsOverlay(false);
    }

    const [spendRequest, setSpendRequest] = useState<SpendRequest>({
        user_id: currentUser.id,
        status: "pending",
        spend_to: "",
        purpose: "",
        spend_request_item: [{
            date_of_use: "",
            amount: 0,
            keihi_class: "",
            invoice_number: 0,
            contact_number: 0,
            memo: "",
            image_save: null
        }]
    });

    // 新しいハンドラ: トップレベルのフィールド用
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
        try {
            const response = await fetch(`${API_URL}/keihi/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Success", data);
            } else {
                throw new Error("Failed to create spend request");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form method="POST" onSubmit={handleSubmit} className="w-full h-full flex">
            <div>
                {isOverlay && loading && <p>Loading...</p>}
                {isOverlay && error && <p>Error: {error.message}</p>}
                {isOverlay && (
                    <div>
                        <button  type="button" onClick={hideOverlay} className="bg-red-500 text-white flex h-flex">閉じる</button>
                        <p>該当するイベントを押して直接入力ができます(未実装)</p>
                        {events.map((event) => (
                            <button key={event.id} className="bg-blue-400 text-white">{formatDateToJapanese(event.start)}, {event.summary}, {event.location}</button>
                        ))}
                    </div>
                )}
                {!isOverlay && <div className="w-1/2">
                    <button type="button" class="bg-blue-400 text-white" onClick={showOverlay}>Googleカレンダーから入力</button>
                </div>}
                
            </div>
            <div className="w-1/2 p-4">
                <input type="file" name="image_save" accept="image/jpg, image/png" onChange={(e) => handleInputChange(0, e as ChangeEvent<HTMLInputElement>)} />
            </div>
            <div className="flex w-1/2 flex-col">
                <div className="mx-auto w-full p-3">
                    <label className="my-2 text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
                    <input type="text" name="purpose" className="mt-1 inputcss" required onChange={handleTopLevelChange} />
                    
                    <label className="my-2 text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
                    <input type="text" name="spend_to" className="mt-1 inputcss" required onChange={handleTopLevelChange} />

                    {spendRequest.spend_request_item.map((item, index) => (
                        <div key={index} className="flex flex-col mx-auto">
                            <label className="my-2 text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                            <input type="date" name="date_of_use" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} />
                            
                            <label className="my-2 text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                            <input type="number" name="amount" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} />

                            <label className="my-2 text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                            <input type="text" name="keihi_class" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} />

                            <label className="my-2 text-xl block text-gray-800">適格請求書番号</label>
                            <input type="number" name="invoice_number" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} />

                            <label className="my-2 text-xl block text-gray-800">連絡請求番号</label>
                            <input type="number" name="contact_number" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} />

                            <label className="my-2 text-xl block text-gray-800">メモ</label>
                            <textarea name="memo" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} />

                            <button type="button" className="bg-red-500 text-white py-2 px-4 rounded my-5" onClick={() => handleRemoveItem(index)}>この項目を削除</button>
                        </div>
                    ))}

                </div>
                <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleAddItem}>項目追加</button>
                <button className="bg-green-500 text-white py-2 px-4 rounded" type="submit">送信</button>
            </div>
        </form>
    );
};

export default CreateSpendRequestFormComponent;
