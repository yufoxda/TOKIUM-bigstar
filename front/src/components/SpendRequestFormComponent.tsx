import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const SpendRequestForm = () => {
    const [count, setCount] = useState(0);
    const { currentUser, token, logout, setCurrentUser } = useAuth();
    const [formData, setFormData] = useState({
        user_id: currentUser.id,
        status: 'wait',
        spend_to: '',
        purpose: '',
        spend_request_item: {
            date_of_use: '',
            amount: 0,
            keihi_class: '',
            invoice_number: 0,
            contact_number: 0,
            memo: '',
            image_save: null
        }
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                spend_request_item: {
                    ...formData.spend_request_item,
                    [name]: files[0]
                }
            });
        } else if (['date_of_use', 'keihi_class', 'memo'].includes(name)) {
            // 文字列フィールドの更新
            setFormData({
                ...formData,
                spend_request_item: {
                    ...formData.spend_request_item,
                    [name]: value
                }
            });
        } else if (['amount', 'invoice_number', 'contact_number'].includes(name)) {
            // 数値フィールドの更新
            setFormData({
                ...formData,
                spend_request_item: {
                    ...formData.spend_request_item,
                    [name]: parseInt(value, 10) || 0  // 値が無効な場合のデフォルト値を0に設定
                }
            });
        } else {
            // その他のフィールドの更新
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('spend_request[user_id]', formData.user_id);
        formDataToSend.append('spend_request[status]', formData.status);
        formDataToSend.append('spend_request[spend_to]', formData.spend_to);
        formDataToSend.append('spend_request[purpose]', formData.purpose);
        formDataToSend.append('spend_request[spend_request_item][date_of_use]', formData.spend_request_item.date_of_use);
        formDataToSend.append('spend_request[spend_request_item][amount]', formData.spend_request_item.amount);
        formDataToSend.append('spend_request[spend_request_item][keihi_class]', formData.spend_request_item.keihi_class);
        formDataToSend.append('spend_request[spend_request_item][invoice_number]', formData.spend_request_item.invoice_number);
        formDataToSend.append('spend_request[spend_request_item][contact_number]', formData.spend_request_item.contact_number);
        formDataToSend.append('spend_request[spend_request_item][memo]', formData.spend_request_item.memo);
        if (formData.spend_request_item.image_save) {
            formDataToSend.append('spend_request[spend_request_item][image_save]', formData.spend_request_item.image_save);
        }

        try {
            // formData を JSON 形式に変換
            const response = await fetch('http://localhost:3000/api/v1/keihi/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    spend_request: {
                        user_id: formData.user_id,
                        status: formData.status,
                        spend_to: formData.spend_to,
                        purpose: formData.purpose,
                        spend_request_item: [{
                            date_of_use: formData.spend_request_item.date_of_use,
                            amount: formData.spend_request_item.amount,
                            keihi_class: formData.spend_request_item.keihi_class,
                            invoice_number: formData.spend_request_item.invoice_number,
                            contact_number: formData.spend_request_item.contact_number,
                            memo: formData.spend_request_item.memo,
                            image_save: formData.spend_request_item.image_save // 画像ファイルは処理が必要
                        
                    }]
                }})
            });

            if (response.ok) {
                console.log('Request succeeded');
            } else {
                console.log('Request failed');
                console.log(formData)
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
    };

    const addCounter = () => {
        setCount(prevCount => prevCount + 1);
    };

    const subCounter = () => {
        setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    };
    
    return (
        <div className="w-full h-full flex flex-col">
            {/* 入力フォームヘッダー */}
            <div className="h-fit flex-none text-3xl p-2">
                アクションによって変更
            </div>
            {/* 入力フォームボディ */}
            <div className="w-full flex-grow overflow-hidden flex">
                {/* 画像のアップロードおよびプレビュー機能を実装したい */}
                <form action="" method="post"  className="w-full overflow-hidden">
                
                    
                    {/* ------------------------- */}
                    <div className="w-full">
                        <div className="w-full flex">
                            <div className="w-1/2  p-4">
                                <input type="file" name="image_save" accept="img/jpg, img/png" onChange={handleInputChange}></input>
                            </div>
                            <div className="flex flex-col">
                                <div className="mb-4 flex flex-row">
                                    <div className="w-1/2">
                                        <button class="bg-blue-400 text-white">Googleカレンダーから入力</button>
                                    </div>
                                    <div className="w-1/2 self-center">
                                        <p>何個目の経費か</p>
                                    </div>
                                </div>
                                <div className="mx-auto w-full p-3 ">
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                                        <input name="date_of_use" type="date" className="inputcss" placeholder="Select date" onChange={handleInputChange}/>
                                    </div>
                                    <div className="my-2">
                                        <label for="example11" className="text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">\</div>
                                            <div className="absolute inset-y-0 right-0 flex items-center text-gray-500">
                                                <label for="currency" className="sr-only">Currency</label>
                                            </div>
                                            <input type="number" name="amount" className="inputcss pl-8" placeholder="0" onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="spend_to" onChange={handleInputChange}  className="inputcss" />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="keihi_class" onChange={handleInputChange} className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
                                        <div className="mt-1">
                                            <input type="text" name="purpose" onChange={handleInputChange}  className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">的確請求書番号</label>
                                        <div className="mt-1">
                                            <input type="number" name="invoice_number" onChange={handleInputChange} className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">連絡請求番号</label>
                                        <div className="mt-1">
                                            <input type="number" name="contact_number" onChange={handleInputChange}  className="inputcss"/>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <label className="text-xl block text-gray-800">メモ</label>
                                        <div className="mt-1">
                                            <textarea id="story" name="memo" rows="8" onChange={handleInputChange} className="inputcss"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                {(() => {
                    const items = [];
                    for (let i = 0; i < count; i++) {
                        items.push(
                            <div className="overflow-hidden flex">
                                {/* 画像のアップロードおよびプレビュー機能を実装したい */}
                                <div className="w-1/2 min-w-fit p-4">
                                    <input type="file" name="example" accept="img/jpg, img/png"></input>
                                </div>
                                {/* ------------------------- */}
                                <div className="w-1/2 p-4 overflow-y-auto">
                                    
                                        <div className="w-1/2 self-center">
                                            <p>何個目の経費か</p>
                                        </div>
                                    
                                    <div className="mx-auto w-full h-full p-3 ">
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                                            <input datepicker id="default-datepicker" type="date" className="inputcss" placeholder="Select date"/>
                                        </div>
                                        <div className="my-2">
                                            <label for="example11" className="text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">\</div>
                                                <div className="absolute inset-y-0 right-0 flex items-center text-gray-500">
                                                    <label for="currency" className="sr-only">Currency</label>
                                                </div>
                                                <input type="number" id="example11" className="inputcss pl-8" placeholder="0" />
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                                            <div className="mt-1">
                                                <input type="text" name="example-required-input" className="inputcss"/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">的確請求書番号</label>
                                            <div className="mt-1">
                                                <input type="text" name="invoice_number"  className="inputcss"/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">連絡請求番号</label>
                                            <div className="mt-1">
                                                <input type="text" name="example-text-input"  className="inputcss"/>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label className="text-xl block text-gray-800">メモ</label>
                                            <div className="mt-1">
                                                <textarea id="story" name="story" rows="5" className="inputcss"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return (
                            <div>{items}</div>
                    );
                })()}
                </div>
                     
                </form>
            </div>
            <div className="h-12 flex-none bottom-0 flex items-center justify-end bg-gray-100 px-5">
                    <div className="flex gap-4 px-2">
                    <button onClick={subCounter} className="bg-red-500 text-white px-4 py-2">削除</button>
                        <button onClick={addCounter} className="bg-green-500 text-white px-4 py-2">追加</button>
                    </div>
                </div>
            {/* 入力フォームフッター */}
            <div className="h-12 flex-none bottom-0 flex items-center justify-end bg-gray-100 px-5">
                <div className="flex gap-4 px-2">
                    <button className="bg-red-500 text-white px-4 py-2">キャンセル</button>
                    <button type="submit" onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2">新規作成</button>
                </div>
            </div>
        </div>
    )
}

export default SpendRequestForm;
