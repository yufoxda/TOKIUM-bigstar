import {useEffect, useState } from 'react';
import useCalendar from '../hooks/useCalendar';
import formatDateToJapanese from '../utils/formatDate';
import { useGetSpendItem } from "../hooks/useGetSpendItem";

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
    const {events, loading, error} = useCalendar();
    const [isOverlay, setIsOverlay] = useState(false);
    

    const { spend, loading_spend, error_spend } = useGetSpendItem(detail_id);
    



    const showOverlay = () => {
        setIsOverlay(true);
    }
    const hideOverlay = () => {
        setIsOverlay(false);
    }
    const [formData, setFormData] = useState({
        formid: 0,
        user_id: currentUser.id,
        status: 'wait',
        spend_to: "",
        purpose: '',
        spend_request_item: [],
    });
    
    const [spend_request_items, setSpendRequestItems] = useState<SpendRequestItem>({
        date_of_use: '',
        amount: 0,
        keihi_class: '',
        invoice_number: 0,
        contact_number: 0,
        memo: '',
        image_save: null
    });

    useEffect(() => {
        // 初回レンダリング時にだけ実行される処理
        console.log('Component mounted for the first time');
        setSpendRequestItems({
            date_of_use: '',
            amount: 0,
            keihi_class: '',
            invoice_number: 0,
            contact_number: 0,
            memo: '',
            image_save: null
        });
        setFormData(prevData => ({
            ...prevData,
            spend_to: "",
            purpose: "",
            spend_request_item: [{
                date_of_use: spend_request_items.date_of_use,
                amount: spend_request_items.amount,
                keihi_class: spend_request_items.keihi_class,
                invoice_number: spend_request_items.invoice_number,
                contact_number: spend_request_items.contact_number,
                memo: spend_request_items.memo,
                image_save: spend_request_items.image_save
                }] // spendRequestItems を直接設定
          }));
      
          console.log(formData)
      }, []);
    


    useEffect(() => {
        if (spend) {
          setFormData(prevData => ({
            ...prevData,
            spend_to: spend.spend_to || prevData.spend_to,
            purpose: spend.purpose || prevData.purpose,
            spend_request_item: spend.spend_request_item || prevData.spend_request_item
          }));
    
          if (spend.spend_request_item.length > 0) {
            setSpendRequestItems(spend.spend_request_item[0]);
          }
        } else {
            setFormData(prevData => ({
                ...prevData,
                spend_to: "",
                purpose: "",
                spend_request_item: []
              }));
          
              setSpendRequestItems({
                date_of_use: '',
                amount: 0,
                keihi_class: '',
                invoice_number: 0,
                contact_number: 0,
                memo: '',
                image_save: null
              });
          
              // spend_request_item を初期化して formData に設定
              setFormData(prevData => ({
                ...prevData,
                spend_request_item: [{
                    spend_request_items
                }]
              }));
            }
      }, [spend]); // 依存関係に spend を追加
    
      useEffect(() => {
        console.log("FormData updated:", formData);
        console.log("FormData updated:", spend_request_items);
        console.log("FormData updated:", formData.spend_request_item[0]);
        
      }, [formData]);
    
      
      

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, files, dataset } = e.target;
        const itemId = parseInt(dataset.itemId || '0', 10); // デフォルトの itemId を設定
    
        if (type === 'file') {
            // ファイルの処理
            setSpendRequestItems(prevItems => prevItems.map((item, index) =>
                index === itemId ? { ...item, [name]: files ? files[0] : null } : item
            ));
        } else if (['date_of_use', 'keihi_class', 'memo'].includes(name)) {
            // テキスト入力の処理
            setSpendRequestItems(prevItems => prevItems.map((item, index) =>
                index === itemId ? { ...item, [name]: value } : item
            ));
        } else if (['amount', 'invoice_number', 'contact_number'].includes(name)) {
            // 数値入力の処理
            setSpendRequestItems(prevItems => prevItems.map((item, index) =>
                index === itemId ? { ...item, [name]: parseInt(value, 10) || 0 } : item
            ));
        } else {
            // formData の処理
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit_create = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const myformDataToSend:SpendRequest = {
            user_id: formData.user_id,
            status: formData.status,
            spend_to: formData.spend_to,
            purpose: formData.purpose,
            spend_request_item :[]
        };

        
        for(let i=1;i<count;i++)
        {
            const item = formData.spend_request_item[i] || {};
            myformDataToSend.spend_request_item.push({
                date_of_use: item.date_of_use || '',
                amount: item.amount || 0,
                keihi_class: item.keihi_class || '',
                invoice_number: item.invoice_number || 0,
                contact_number: item.contact_number || 0,
                memo: item.memo || '',
                image_save: item.image_save || null
            });
        }


        const requestBody = {
            spend_request: myformDataToSend
        }

        console.log(myformDataToSend)
        try {
            const response = await fetch('http://localhost:3000/api/v1/keihi/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    spend_request: myformDataToSend
                })
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
        
        const myformDataToSend:SpendRequest = {
            user_id: formData.user_id,
            status: formData.status,
            spend_to: formData.spend_to,
            purpose: formData.purpose,
            spend_request_item :[]
        };

        
        for(let i=1;i<count;i++)
        {
            const item = formData.spend_request_item[i] || {};
            myformDataToSend.spend_request_item.push({
                date_of_use: item.date_of_use || '',
                amount: item.amount || 0,
                keihi_class: item.keihi_class || '',
                invoice_number: item.invoice_number || 0,
                contact_number: item.contact_number || 0,
                memo: item.memo || '',
                image_save: item.image_save || null
            });
        }


        const requestBody = {
            spend_request: myformDataToSend
        }

        console.log(myformDataToSend)
        try {
            const response = await fetch('http://localhost:3000/api/v1/keihi/update/', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    spend_request: myformDataToSend
                })
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
    };
    const subCounter = () => {
        setCount(prevCount => prevCount > 1 ? prevCount - 1 : 1);
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
                    <div className="w-full h-fit">
                        <div className="w-full h-full flex">
                            <div className="w-1/2 h-full  p-4">
                                <input type="file" name="image_save" accept="img/jpg, img/png" onChange={handleInputChange}></input>
                            </div>
                            <div className="flex w-1/2 h-full flex-col">
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
                                        <input name="date_of_use" type="date" value = {formData.spend_request_item.date_of_use || ""} className="inputcss" onChange={handleInputChange} data-item-id={0} required/>
                                        
                                    </div>
                                    <div className="my-2">
                                        <label for="example11" className="text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">\</div>
                                            <input type="number" name="amount" className="inputcss pl-8" placeholder="0"  value="" data-item-id={0} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="spend_to" onChange={handleInputChange}  value=""  className="inputcss" data-item-id={0} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="keihi_class" onChange={handleInputChange}  value="" className="inputcss" data-item-id={0} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="purpose" onChange={handleInputChange}   value="" className="inputcss" data-item-id={0} required/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">的確請求書番号</label>
                                        <div className="mt-1">
                                            <input type="number" name="invoice_number" onChange={handleInputChange}  value="" data-item-id={0} className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">連絡請求番号</label>
                                        <div className="mt-1">
                                            <input type="number" name="contact_number" onChange={handleInputChange} value="" data-item-id={0}  className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">メモ</label>
                                        <div className="mt-1">
                                            <textarea id="story" name="memo" rows="8" onChange={handleInputChange} value="" data-item-id={0} className="inputcss"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                {(() => {
                    const items = [];
                        for (let i = 2; i <= (spend ? spend.spend_request_item.length : count); i++) {
                        
                        items.push(
                            <div className="flex">
                                <div className="w-1/2 min-w-fit p-4">
                                    <input type="file" name="example" accept="img/jpg, img/png"></input>
                                </div>
                                <div className="w-1/2  p-4">
                                    <div className="w-1/2 self-center">
                                        <p>{i}</p>
                                    </div>
                                    <div className="mx-auto w-full h-full p-3 ">
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                                            <input name="date_of_use" type="date" className="inputcss"  value={spend?spend.spend_request_item[i-1].date_of_use:""} onChange={handleInputChange} data-item-id={i} required/>
                                        </div>
                                        <div className="my-2">
                                            <label for="example11" className="text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">\</div>
                                                <input type="number" name="amount" className="inputcss pl-8" placeholder="0" value={spend?spend.spend_request_item[1].amount:""} onChange={handleInputChange} data-item-id={i} required/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                                            <div className="mt-1">
                                                <input type="text" name="keihi_class" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].keihi_class:""} className="inputcss" data-item-id={i} required/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">的確請求書番号</label>
                                            <div className="mt-1">
                                                <input type="number" name="invoice_number" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].invoice_number:""}  data-item-id={i} className="inputcss"/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">連絡請求番号</label>
                                            <div className="mt-1">
                                                <input type="number" name="contact_number" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].contact_number:""} data-item-id={i}  className="inputcss"/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">メモ</label>
                                            <div className="mt-1">
                                                <textarea id="story" name="memo" rows="8" onChange={handleInputChange} value={spend?spend.spend_request_item[i-1].memo:""} data-item-id={i} className="inputcss"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    
                    };
                    
                    
                    return (
                            <div>{items}
                                <div className="h-12 flex-none bottom-0 flex items-center justify-center px-5">
                                    <div className="flex gap-4 px-2">
                                        <button type="button" onClick={subCounter} >
                                            <svg class="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                        </button>
                                        

                                        <button type="button" onClick={addCounter}>
                                            <svg class="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                        </button>
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
