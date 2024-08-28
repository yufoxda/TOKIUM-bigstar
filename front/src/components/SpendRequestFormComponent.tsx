import { useEffect, useState } from "react";
import useCalendar from "../hooks/useCalendar";
import formatDateToJapanese from "../utils/formatDate";
import { useGetSpendItem } from "../hooks/useGetSpendItem";
import { useAuth } from "../hooks/useAuth";

interface SpendRequestItem {
  date_of_use: string;
  amount: number;
  keihi_class: string;
  invoice_number: number;
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

const SpendRequestForm = ({
  is_create,
  detail_id,
}: {
  is_create: boolean;
  detail_id: string;
}) => {
  const [count, setCount] = useState(1);
  const { currentUser } = useAuth();
  const { events, loading, error } = useCalendar();
  const [isOverlay, setIsOverlay] = useState(false);
  const { spend, loading_spend, error_spend } = useGetSpendItem(detail_id);

  const [formData, setFormData] = useState<SpendRequest>({
    user_id: currentUser.id,
    status: "wait",
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
    if (spend) {
      setFormData((prevData) => ({
        ...prevData,
        
        spend_to: spend.spend_to || prevData.spend_to,
        purpose: spend.purpose || prevData.purpose,
        spend_request_item: spend.spend_request_item.map((item) => {
            const { ...rest } = item;  // idを取り除く
            return rest;  // 残りのプロパティだけを返す
          }),
      }));
    }
  }, [spend]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, files, dataset } = e.target;
    const itemId = parseInt(dataset.itemId || "0", 10);

    if (type === "file") {
      const file = files ? files[0] : null;
      setFormData((prevData) => {
        const updatedItems = [...prevData.spend_request_item];
        updatedItems[itemId] = { ...updatedItems[itemId], [name]: file };
        return { ...prevData, spend_request_item: updatedItems };
      });
    } else {
      setFormData((prevData) => {
        const updatedItems = [...prevData.spend_request_item];
        if (["date_of_use", "keihi_class", "memo"].includes(name)) {
          updatedItems[itemId] = { ...updatedItems[itemId], [name]: value };
        } else if (
          ["amount", "invoice_number", "contact_number"].includes(name)
        ) {
          updatedItems[itemId] = {
            ...updatedItems[itemId],
            [name]: parseInt(value, 10) || 0,
          };
        } else {
          return { ...prevData, [name]: value };
        }
        return { ...prevData, spend_request_item: updatedItems };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/keihi/${is_create ? "create" : "update/" +  detail_id}`,
        {
          method: is_create ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ spend_request: formData }),
        }
      );

      if (response.ok) {
        console.log("Request succeeded");
      } else {
        console.log("Request failed", JSON.stringify({ spend_request: formData }));

      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const addCounter = () => {
    setCount((prevCount) => prevCount + 1);
    setFormData((prevData) => ({
      ...prevData,
      spend_to: "",
      purpose: "",
      spend_request_item: [
        ...prevData.spend_request_item,
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
    }));
  };

  const subCounter = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount<2 ? prevCount: - 1);
      setFormData((prevData) => {
        const updatedItems = [...prevData.spend_request_item];
        updatedItems.pop();
        return { ...prevData, spend_request_item: updatedItems };
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit } className="w-full h-full">
      <div className="w-full h-full flex flex-col">
        <div className="h-fit flex-none text-3xl p-2">
          {is_create ? "新規作成" : "編集"}
        </div>
        <div className="w-full h-full flex-grow flex overflow-auto">
            <div className="w-full h-fit">
            {formData.spend_request_item.map((item, index) => (
              <div key={index} className="w-full h-full flex">
                
                <div className="w-1/2 p-4">
                  <input
                    type="file"
                    name="image_save"
                    accept="image/jpg, image/png"
                    onChange={handleInputChange}
                    data-item-id={index}
                  />
                </div>
                <div className="w-1/2 p-4">
                <div w-full flex flex-row>
  
                    <div>{index + 1}</div>
                </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">
                      利用日<span className="text-red-600 text-base">*</span>
                    </label>
                    {console.log(formData, index,spend)}
                    <input
                      name="date_of_use"
                      type="date"
                      value={item.date_of_use}
                      className="inputcss"
                      onChange={handleInputChange}
                      data-item-id={index}
                      required
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">
                      金額<span className="text-red-600 text-base">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      className="inputcss"
                      value={item.amount}
                      onChange={handleInputChange}
                      data-item-id={index}
                      required
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">
                      支払先<span className="text-red-600 text-base">*</span>
                    </label>
                    <input
                      type="text"
                      name="spend_to"
                      value={formData.spend_to}
                      onChange={handleInputChange}
                      className="inputcss"
                      required
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">
                      経費科目<span className="text-red-600 text-base">*</span>
                    </label>
                    <input
                      type="text"
                      name="keihi_class"
                      value={item.keihi_class}
                      onChange={handleInputChange}
                      className="inputcss"
                      data-item-id={index}
                      required
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">
                      目的<span className="text-red-600 text-base">*</span>
                    </label>
                    <input
                      type="text"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="inputcss"
                      required
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">
                      的確請求書番号
                    </label>
                    <input
                      type="number"
                      name="invoice_number"
                      value={item.invoice_number}
                      onChange={handleInputChange}
                      className="inputcss"
                      data-item-id={index}
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">
                      連絡先番号
                    </label>
                    <input
                      type="number"
                      name="contact_number"
                      value={item.contact_number}
                      onChange={handleInputChange}
                      className="inputcss"
                      data-item-id={index}
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-xl block text-gray-800">メモ</label>
                    <textarea
                      name="memo"
                      value={item.memo}
                      onChange={handleInputChange}
                      className="inputcss"
                      data-item-id={index}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="w-full flex justify-center gap-4 px-2">
                <button type="button" onClick={addCounter}>
                    <svg class="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                </button>
            </div>
            </div>
        </div>
        <div className="w-full h-fit p-4">
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            送信
          </button>
        </div>
      </div>
    </form>
  );
};

export default SpendRequestForm;
