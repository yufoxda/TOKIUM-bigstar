import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from '../hooks/useAuth';
import useCalendar from '../hooks/useCalendar';
import formatDateToJapanese, { formatDateToYYYYMMDD } from '../utils/formatDate';
import parseDescription from '../utils/parseDescription';
import { ImagePreviewComponent } from './ImagePreviewComponent';
import SpendRequestForm from './CheckRequestFormComponent';


interface SpendRequestItem {
  date_of_use: string;
  amount: number;
  keihi_class: string;
  invoice_number: string | null;
  contact_number: string | null;
  memo: string;
  image_save: any;
}

interface SpendRequest {
  user_id: string;
  status: string;
  spend_to: string;
  purpose: string;
  spend_request_item: SpendRequestItem[];
}

const CreateSpendRequestFormComponent = () => {
  const { currentUser, token } = useAuth();
  const { events, loading, error } = useCalendar();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit } = useForm<SpendRequest>();
  const API_URL = "http://localhost:3000/api/v1";


  const [spendRequest, setSpendRequest] = useState<SpendRequest>({
    user_id: currentUser.id,
    status: "pending",
    spend_to: "",
    purpose: "",
    spend_request_item: [{
      date_of_use: "",
      amount: 0,
      keihi_class: "",
      invoice_number: null,
      contact_number: null,
      memo: "",
      image_save: null
    }]
  });



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleTopLevelChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSpendRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const values = [...spendRequest.spend_request_item];
    values[index][event.target.name as keyof SpendRequestItem] =
      event.target.value;
    setSpendRequest({ ...spendRequest, spend_request_item: values });
    console.log(spendRequest.spend_request_item[0].image_save)
  };

  // inputタグから画像ファイルを取得し、base64にエンコードしてspendRequestに保存する
  const handleInputImage = (e: any,index: number) => {
    const file = e.target.files[0]; // 一つのinputタグあたりに1つまで画像を許容
    if (!file){
        return
    }

    const reader= new FileReader();
    reader.onloadend =()=>{
        // ブロック内の処理は、画像が読み込まれた後に実行される
        const base64image = reader.result as string;
        
        setSpendRequest((prevState)=>{
            const updatedItems=[...prevState.spend_request_item];
            updatedItems[index].image_save=base64image;
            return {...prevState,spend_request_item: updatedItems};
        })
    }
    reader.readAsDataURL(file);

};

  const handleAddItem = () => {
    setSpendRequest({
      ...spendRequest,
      spend_request_item: [
        ...spendRequest.spend_request_item,
        {
          date_of_use: "",
          amount: 0,
          keihi_class: "",
          invoice_number: null,
          contact_number: null,
          memo: "",
          image_save: null,
        },
      ],
    });
    console.timeLog(spendRequest.spend_request_item[0].image_save)
  };

  const handleCalenderEventClick = (event: any) => {
    const updatedItems = [...spendRequest.spend_request_item];
    const parsed = parseDescription(event);

    // 最後のアイテムを更新
    updatedItems[updatedItems.length - 1] = {
      ...updatedItems[updatedItems.length - 1],
      date_of_use: formatDateToYYYYMMDD(event.start) || "",
      amount: parsed.amount,
      keihi_class: parsed.keihi_class,
      invoice_number: parsed.invoice_number,
      contact_number: parsed.contact_number,
      memo: event.description || "",
      image_save: null,
    };

    // 更新された `spend_request_item` 配列をセット
    setSpendRequest({
      ...spendRequest,
      spend_to: parsed.spend_to || "",
      purpose: event.summary || "",
      spend_request_item: updatedItems,
    });
    setShowModal(false);
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

    

  

  const onSubmit: SubmitHandler<SpendRequest> = async (data) => {
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

    window.location.reload();
  };

    //　ーーーーー清水の変更 end ーーーーー

  return (
    <form method="POST" onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
      <div className="w-full h-full flex flex-col">
        <div className="h-14 flex items-center text-3xl my-3 px-3">
          新規作成
        </div>
        <label className="my-2 text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
        <input type="text" name="purpose" className="mt-1 inputcss" required onChange={handleTopLevelChange} value={spendRequest.purpose} />

        <label className="my-2 text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
        <input type="text" name="spend_to" className="mt-1 inputcss" required onChange={handleTopLevelChange} value={spendRequest.spend_to} />

        <div className="w-full h-full flex-grow overflow-auto px-3">
          <div className="w-full h-full">
            {spendRequest.spend_request_item.map((item, index) => (
              <div key={index} className="w-full h-fit flex">
                <div className="w-1/2">
                  {/* <ImageFormComponent /> */}
                  <input type="file" accept="image/jpeg, image/png" className="left-2 mt-2" onChange={(e)=>handleInputImage(e,index)}/>
                  <ImagePreviewComponent base64image={item.image_save}/>
                </div>
                <div className="w-1/2">
                  {/* モーダル表示ボタン */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 mx-auto rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    Googleカレンダーから入力
                  </button>

                  <div>
                    <label className="my-2 text-xl block text-gray-800">利用日<span className="text-red-600 text-base">*</span></label>
                    <input type="date" name="date_of_use" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} value={item.date_of_use} />

                    <label className="my-2 text-xl block text-gray-800">金額<span className="text-red-600 text-base">*</span></label>
                    <input type="number" name="amount" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} value={item.amount} />

                    <label className="my-2 text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                    <input type="text" name="keihi_class" className="mt-1 inputcss" required onChange={(e) => handleInputChange(index, e)} value={item.keihi_class} />

                    <label className="my-2 text-xl block text-gray-800">適格請求書番号</label>
                    <input type="text" name="invoice_number" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} value={item.invoice_number || ''} />

                    <label className="my-2 text-xl block text-gray-800">連絡請求番号</label>
                    <input type="text" name="contact_number" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} value={item.contact_number || ''} />

                    <label className="my-2 text-xl block text-gray-800">メモ</label>
                    <textarea name="memo" className="mt-1 inputcss" onChange={(e) => handleInputChange(index, e)} value={item.memo} />
                  </div>
                  <button type="button" className="w-full px-4 rounded bg-white" onClick={() => handleRemoveItem(index)}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="bg-white py-2 px-4 rounded w-full" onClick={handleAddItem}>
              <svg className="w-6 h-6 text-gray-800 dark:text-white mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="h-12 w-full flex-none">
          <button className="w-full bg-green-500 text-white rounded" type="submit">申請</button>
        </div>
      </div>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div ref={modalRef} className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    イベントを選択
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <div>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {(
                      <div>
                        <p>該当するイベントを押して直接入力ができます</p>
                        <p>複数日に渡って予定が入っている場合は開始日が入力されます</p>
                        {events.map((event) => (
                          <button key={event.id} className="bg-blue-400 text-white" onClick={() => handleCalenderEventClick(event)}>
                            {formatDateToJapanese(event.start)}, {event.summary} {event.location && `, (${event.location})`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </form>
  );
};

export default CreateSpendRequestFormComponent;
