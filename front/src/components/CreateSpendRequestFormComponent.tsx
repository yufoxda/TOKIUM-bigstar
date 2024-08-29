import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import useCalendar from "../hooks/useCalendar";
import formatDateToJapanese, {
  formatDateToYYYYMMDD,
} from "../utils/formatDate";

interface SpendRequestItem {
  date_of_use: string;
  amount: number;
  keihi_class: string;
  invoice_number: number | null;
  contact_number: number;
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
  const { register, handleSubmit } = useForm();
  const API_URL = "http://localhost:3000/api/v1";

  const [spendRequest, setSpendRequest] = useState<SpendRequest>({
    user_id: currentUser.id,
    status: "pending",
    spend_to: "",
    purpose: "",
    spend_request_item: [
      {
        date_of_use: "",
        amount: 0,
        keihi_class: "",
        invoice_number: 0,
        contact_number: 0,
        memo: "",
        image_save: null,
      },
    ],
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
          invoice_number: "",
          contact_number: "",
          memo: "",
          image_save: null,
        },
      ],
    });
  };

  const handleCalenderEventClick = (event: any) => {
    const updatedItems = [...spendRequest.spend_request_item];

    // 最後のアイテムを更新
    updatedItems[updatedItems.length - 1] = {
      ...updatedItems[updatedItems.length - 1],
      date_of_use: formatDateToYYYYMMDD(event.start) || "",
      amount: 0,
      keihi_class: "",
      invoice_number: null,
      contact_number: 0,
      memo: event.description || "",
      image_save: null,
    };

    // 更新された `spend_request_item` 配列をセット
    setSpendRequest({
      ...spendRequest,
      spend_to: event.location || "",
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

  const handleFormSubmit = async (event: FormEvent) => {
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

    window.location.reload();
  };

  return (
    <form method="POST" onSubmit={handleFormSubmit} className="w-full h-full">
      <div className="w-full h-full flex flex-col">
        <div className="h-fit flex-none text-3xl p-2">新規作成</div>
        <div className="w-full h-full flex-grow flex overflow-auto flex">
          <div className="w-1/2 p-4">
            <input
              type="file"
              name="image_save"
              accept="image/jpg, image/png"
              onChange={(e) =>
                handleInputChange(0, e as ChangeEvent<HTMLInputElement>)
              }
            />
          </div>
          <div className="w-1/2 p-4">
            {/* モーダル表示ボタン */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Googleカレンダーから入力
            </button>

            <label className="my-2 text-xl block text-gray-800">
              目的<span className="text-red-600 text-base">*</span>
            </label>
            <input
              type="text"
              name="purpose"
              className="mt-1 inputcss"
              required
              onChange={handleTopLevelChange}
              value={spendRequest.purpose}
            />

            <label className="my-2 text-xl block text-gray-800">
              支払先<span className="text-red-600 text-base">*</span>
            </label>
            <input
              type="text"
              name="spend_to"
              className="mt-1 inputcss"
              required
              onChange={handleTopLevelChange}
              value={spendRequest.spend_to}
            />

            {spendRequest.spend_request_item.map((item, index) => (
              <div key={index} className="">
                <label className="my-2 text-xl block text-gray-800">
                  利用日<span className="text-red-600 text-base">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_use"
                  className="mt-1 inputcss"
                  required
                  onChange={(e) => handleInputChange(index, e)}
                  value={item.date_of_use}
                />

                <label className="my-2 text-xl block text-gray-800">
                  金額<span className="text-red-600 text-base">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="mt-1 inputcss"
                  required
                  {...register("amount", { min: 0 })}
                  onChange={(e) => {
                    const value = e.target.value;
                    // マイナスの値が入力された場合は空文字に設定
                    if (value < 0) {
                      e.target.value = "";
                    }
                    handleInputChange(index, e);
                  }}
                  value={item.amount}
                  min="0"
                />

                <label className="my-2 text-xl block text-gray-800">
                  経費科目<span className="text-red-600 text-base">*</span>
                </label>
                <input
                  type="text"
                  name="keihi_class"
                  className="mt-1 inputcss"
                  required
                  onChange={(e) => handleInputChange(index, e)}
                  value={item.keihi_class}
                />

                <label className="my-2 text-xl block text-gray-800">
                  適格請求書番号
                </label>
                <input
                  type="tel"
                  name="invoice_number"
                  className="mt-1 inputcss"
                  onChange={(e) => handleInputChange(index, e)}
                  title="13桁の数字を入力してください" // ユーザーに入力フォーマットを示す
                  value={item.invoice_number}
                  pattern="\d{13}" // パターンを指定
                />
                <label className="my-2 text-xl block text-gray-800">
                  連絡請求番号
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  className="mt-1 inputcss"
                  onChange={(e) => handleInputChange(index, e)}
                  value={item.contact_number}
                  pattern="\d{3}-\d{4}-\d{4}" // パターンを指定
                />

                <label className="my-2 text-xl block text-gray-800">メモ</label>
                <textarea
                  name="memo"
                  className="mt-1 inputcss"
                  onChange={(e) => handleInputChange(index, e)}
                  value={item.memo}
                />

                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 rounded my-5"
                  onClick={() => handleRemoveItem(index)}
                >
                  この項目を削除
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleAddItem}
            >
              項目追加
            </button>
          </div>
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          type="submit"
        >
          送信
        </button>
      </div>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              ref={modalRef}
              className="relative w-auto my-6 mx-auto max-w-3xl"
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">イベントを選択</h3>
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
                    {
                      <div>
                        <p>該当するイベントを押して直接入力ができます</p>
                        <p>
                          複数日に渡って予定が入っている場合は開始日が入力されます
                        </p>
                        {events.map((event) => (
                          <button
                            key={event.id}
                            className="bg-blue-400 text-white"
                            onClick={() => handleCalenderEventClick(event)}
                          >
                            {formatDateToJapanese(event.start)}, {event.summary}{" "}
                            {event.location && `, (${event.location})`}
                          </button>
                        ))}
                      </div>
                    }
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
                  {/* <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        自動入力
                                        
                                    </button> */}
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
