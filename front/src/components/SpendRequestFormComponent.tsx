import { useState } from 'react';
import useCalendar from '../hooks/useCalendar';
import { useGetSpendItem } from "../hooks/useGetSpendItem";
import formatDateToJapanese from '../utils/formatDate';

import { useAuth } from '../hooks/useAuth';


interface SpendRequestItem{
    date_of_use: string,
    amount: BigInteger,
    keihi_class: string,
    invoice_number: BigInteger,
    contact_number: BigInteger,
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

const SpendRequestForm = ({ is_create, detail_id }: { is_create: boolean; detail_id: string }) => {
    const [count, setCount] = useState(1);
    const { currentUser, token, logout, setCurrentUser } = useAuth();
    const { events, loading, error } = useCalendar();
    const [isOverlay, setIsOverlay] = useState(false);
    const { spend, loading_spend, error_spend } = useGetSpendItem(detail_id);

    const showOverlay = () => {
        setIsOverlay(true);
    }

    const hideOverlay = () => {
        setIsOverlay(false);
    }

    const [formData, setFormData] = useState<SpendRequest>({
        user_id: currentUser.id,
        status: 'wait',
        spend_to: '',
        purpose: '',
        spend_request_item: []
    });

    const handleInputChange = (e) => {
        const { name, value, type, files, dataset } = e.target;
        const itemId = parseInt(dataset.itemId || '1', 10) - 1; // `itemId` を0から始まるインデックスに変更

        let updatedItems = [...formData.spend_request_item];

        if (!updatedItems[itemId]) {
            updatedItems[itemId] = {
                date_of_use: '',
                amount: 0,
                keihi_class: '',
                invoice_number: 0,
                contact_number: 0,
                memo: '',
                image_save: null
            };
        }

        if (type === 'file') {
            updatedItems[itemId] = {
                ...updatedItems[itemId],
                [name]: files ? files[0] : null
            };
        } else if (['date_of_use', 'keihi_class', 'memo'].includes(name)) {
            updatedItems[itemId] = {
                ...updatedItems[itemId],
                [name]: value
            };
        } else if (['amount', 'invoice_number', 'contact_number'].includes(name)) {
            updatedItems[itemId] = {
                ...updatedItems[itemId],
                [name]: parseInt(value, 10) || 0
            };
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
            return;
        }

        setFormData(prevData => ({
            ...prevData,
            spend_request_item: updatedItems
        }));
    };

    const handleSubmit_create = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/v1/keihi/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ spend_request: formData })
            });

            if (response.ok) {
                console.log('Request succeeded');
            } else {
                console.log('Request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit_update = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/api/v1/keihi/update/${detail_id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ spend_request: formData })
            });

            if (response.ok) {
                console.log('Request succeeded');
            } else {
                console.log('Request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addCounter = () => {
        setCount(prevCount => prevCount + 1);
        setFormData(prevData => ({
            ...prevData,
            spend_request_item: [...prevData.spend_request_item, {
                date_of_use: '',
                amount: 0,
                keihi_class: '',
                invoice_number: 0,
                contact_number: 0,
                memo: '',
                image_save: null
            }]
        }));
    };

    const subCounter = () => {
        setCount(prevCount => prevCount > 1 ? prevCount - 1 : 1);
        setFormData(prevData => ({
            ...prevData,
            spend_request_item: prevData.spend_request_item.slice(0, -1)
        }));
    };
   
    
    return (
        <form action="" method="post" onSubmit={is_create ? handleSubmit_create : handleSubmit_update} className="w-full h-full">
        <div className="w-full h-full flex flex-col">
            {/* 入力フォームヘッダー */}
            <div className="h-fit flex-none text-3xl p-2">
            {is_create ? "新規作成" : "編集"}
            
            </div>
            {/* 入力フォームボディ */}
            <div className="w-full h-full flex-grow flex overflow-auto">
                {/* 画像のアップロードおよびプレビュー機能を実装したい */}
                    {/* ------------------------- */}
                    <div className="w-full h-full">
                        <div className="w-full flex">
                            <div className="w-1/2  p-4">
                                <input type="file" name="image_save" accept="img/jpg, img/png" onChange={handleInputChange}></input>
                            </div>
                            <div className="flex w-1/2 flex-col">
                                <div className="mb-4 flex flex-row">
                                    <div className="w-1/2">
                                    <div>
                                        {isOverlay && loading && <p>Loading...</p>}
                                        {isOverlay && error && <p>Error: {error.message}</p>}
                                        {isOverlay && (
                                            <div>
                                                <button  type="button" onClick={hideOverlay} className="bg-red-500 text-white">閉じる</button>
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
                                    </div>
                                    <div className="w-1/2 self-center">
                                        <p>1</p>
                                    </div>
                                </div>
                                <div className="mx-auto w-full p-3 ">
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                                        <input name="date_of_use" type="date" value={spend?spend.spend_request_item[0].date_of_use:null} className="inputcss" onChange={handleInputChange} data-item-id={1} required/>
                                    </div>
                                    <div className="my-2">
                                        <label for="example11" className="text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">\</div>
                                            <input type="number" name="amount" className="inputcss pl-8" placeholder="0" value={spend?spend.spend_request_item[0].amount:null} onChange={handleInputChange} data-item-id={1} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="spend_to" onChange={handleInputChange} value={spend?spend.spend_to:null}  className="inputcss" data-item-id={1} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="keihi_class" onChange={handleInputChange} value={spend?spend.spend_request_item[0].keihi_class:null} className="inputcss" data-item-id={1} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="purpose" onChange={handleInputChange}  value={spend?spend.purpose:null} className="inputcss" data-item-id={1} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">的確請求書番号</label>
                                        <div className="mt-1">
                                            <input type="number" name="invoice_number" onChange={handleInputChange} value={spend?spend.spend_request_item[0].invoice_number:null} data-item-id={1} className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">連絡請求番号</label>
                                        <div className="mt-1">
                                            <input type="number" name="contact_number" onChange={handleInputChange} value={spend?spend.spend_request_item[0].contact_number:null} data-item-id={1}  className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">メモ</label>
                                        <div className="mt-1">
                                            <textarea id="story" name="memo" rows="8" onChange={handleInputChange} value={spend?spend.spend_request_item[0].memo:null} data-item-id={1} className="inputcss"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                {(() => {
                    const items = [];
                    console.log(spend)
                    for (let i = 2; i <= (spend ? spend.spend_request_item.length : count); i++) {
                        console.log(i)
                        items.push(
                            <div className="flex">
                                <div className="w-1/2 min-w-fit p-4">
                                    <input type="file" name="example" accept="img/jpg, img/png"></input>
                                </div>
                                <div className="w-1/2 p-4">
                                    <div className="w-1/2 self-center">
                                        <p>{i}</p>
                                    </div>
                                    <div className="mx-auto w-full h-full p-3 ">
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                                            <input name="date_of_use" type="date" className="inputcss"  value={spend?spend.spend_request_item[i-1].date_of_use:null} onChange={handleInputChange} data-item-id={i} required/>
                                        </div>
                                        <div className="my-2">
                                            <label for="example11" className="text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">\</div>
                                                <input type="number" name="amount" className="inputcss pl-8" placeholder="0" value={spend?spend.spend_request_item[1].amount:null} onChange={handleInputChange} data-item-id={i} required/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                                            <div className="mt-1">
                                                <input type="text" name="keihi_class" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].keihi_class:null} className="inputcss" data-item-id={i} required/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">的確請求書番号</label>
                                            <div className="mt-1">
                                                <input type="number" name="invoice_number" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].invoice_number:null}  data-item-id={i} className="inputcss"/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">連絡請求番号</label>
                                            <div className="mt-1">
                                                <input type="number" name="contact_number" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].contact_number:null} data-item-id={i}  className="inputcss"/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">メモ</label>
                                            <div className="mt-1">
                                                <textarea id="story" name="memo" rows="8" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].memo:null} data-item-id={i} className="inputcss"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return (
                            <div>{items}
                                <div className="h-12 flex-none bottom-0 flex items-center justify-end bg-gray-100 px-5">
                                    <div className="flex gap-4 px-2">
                                        <button type="button" onClick={subCounter} className="bg-red-500 text-white px-4 py-2">削除</button>
                                        <button type="button" onClick={addCounter} className="bg-green-500 text-white px-4 py-2">追加</button>
                                    </div>
                                </div>
                            </div>
                    );
                })()}
                </div>
                     
                
            </div>
            
            {/* 入力フォームフッター */}
            <div className="h-12 flex-none flex items-center justify-end bg-gray-100 px-5">
                <div className="flex gap-4 px-2">
                    <button className="bg-red-500 text-white px-4 py-2">キャンセル</button>
                    <button type="submit"  className="bg-green-500 text-white px-4 py-2">申請</button>
                </div>
            </div>
        </div>
        </form>
    )
}

export default SpendRequestForm;
