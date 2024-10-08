import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCsrf } from "../hooks/useCsrf";
import { useGetAllSpendItem } from "../hooks/useGetAllSpendItem";

const API_URL = "http://localhost:3000/api/v1";

interface SpendRequestItem {
  date_of_use: string;
  amount: number;
  keihi_class: string;
  invoice_number: number | null;
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

const AuthTableComponent = () => {
  const { token } = useAuth();
  const { csrfToken } = useCsrf();
  const { spend } = useGetAllSpendItem<SpendRequest>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showPending, setShowPending] = useState(false);
  const itemsPerPage = 5;

  // 未承認フィルタリング
  const filteredSpend = showPending
    ? spend.filter(
        (item) => item.status === "pending" || item.status === "wait"
      )
    : spend;

  // ページネーション用のデータ
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSpend.slice(indexOfFirstItem, indexOfLastItem);

  const calculateTotalAmount = (items: SpendRequestItem[]): number =>
    items.reduce((total, item) => total + item.amount, 0);

  const changeStatus = (spend_id: string, status: string) => {
    fetch(`${API_URL}/keihi/change_status?id=${spend_id}&status=${status}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Error changing status", error);
    });
    window.location.reload();
  };

  // ページの移動
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);
  const totalPages = Math.ceil(filteredSpend.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mt-4">
        <button
          onClick={firstPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          最初へ
        </button>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          前へ
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          次へ
        </button>
        <button
          onClick={lastPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          最後へ
        </button>

        <div className="flex items-center ml-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={showPending}
              onChange={() => setShowPending(!showPending)}
            />
            <span className="ml-2 text-gray-700">未承認のみ</span>
          </label>
        </div>
      </div>
      {currentItems.map((item, index) => (
        <div key={index} className="mb-8">
          <p className="text-lg font-bold">
            申請者: <span className="font-normal">{item.user_name}</span>
          </p>
          <p className="text-lg font-bold">
            申請状況: <span className="font-normal">{item.status}</span>
          </p>
          <p className="text-lg font-bold">
            訪問先: <span className="font-normal">{item.spend_to}</span>
          </p>
          <p className="text-lg font-bold">
            目的: <span className="font-normal">{item.purpose}</span>
          </p>
          <div className="text-lg font-bold mt-4">
            合計金額:{" "}
            <span
              className={`font-normal ${
                calculateTotalAmount(item.spend_request_item) > 100000
                  ? "text-red-600"
                  : ""
              }`}
            >
              {calculateTotalAmount(item.spend_request_item)}円
            </span>
          </div>

          <p className="text-lg font-bold mt-4">申請項目: </p>
          <table className="min-w-full bg-white border border-gray-200 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
                  利用日
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
                  金額
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
                  経費区分
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
                  請求書番号
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
                  連絡先
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">
                  備考
                </th>
              </tr>
            </thead>
            <tbody>
              {item.spend_request_item.map((requestItem, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">
                    {requestItem.date_of_use}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {requestItem.amount}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {requestItem.keihi_class}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {requestItem.invoice_number}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {requestItem.contact_number}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {requestItem.memo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex space-x-4 mt-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => changeStatus(item.id, "approve")}
            >
              承認
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => changeStatus(item.id, "reject")}
            >
              拒否
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => changeStatus(item.id, "pending")}
            >
              審査中に戻す
            </button>
          </div>
        </div>
      ))}

      {/* ページネーション */}
      <div className="flex justify-center mt-4">
        <button
          onClick={firstPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          最初へ
        </button>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          前へ
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          次へ
        </button>
        <button
          onClick={lastPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          最後へ
        </button>
      </div>
    </div>
  );
};

export default AuthTableComponent;
