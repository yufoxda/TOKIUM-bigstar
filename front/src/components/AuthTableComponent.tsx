import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCsrf } from '../hooks/useCsrf';
import { useGetAllSpendItem } from '../hooks/useGetAllSpendItem';

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
    const itemsPerPage = 5;

    // ページネーション用のデータ
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = spend.slice(indexOfFirstItem, indexOfLastItem);

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
    }

    // ページの移動
    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);
    const totalPages = Math.ceil(spend.length / itemsPerPage);

    return (
        <div className="container mx-auto p-4">
            {currentItems.map((item, index) => (
                <div key={index} className="mb-8">
                    <p className="text-lg font-bold">申請者: <span className="font-normal">{item.user_name}</span></p>
                    <p className="text-lg font-bold">申請状況: <span className="font-normal">{item.status}</span></p>
                    <p className="text-lg font-bold">申請先: <span className="font-normal">{item.spend_to}</span></p>
                    <p className="text-lg font-bold">目的: <span className="font-normal">{item.purpose}</span></p>

                    <p className="text-lg font-bold mt-4">申請項目: </p>
                    <table className="min-w-full bg-white border border-gray-200 mt-2">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">利用日</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">金額</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">経費区分</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">請求書番号</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">連絡先</th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 text-left">備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.spend_request_item.map((requestItem, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b border-gray-200">{requestItem.date_of_use}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{requestItem.amount}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{requestItem.keihi_class}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{requestItem.invoice_number}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{requestItem.contact_number}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{requestItem.memo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex space-x-4 mt-4">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => changeStatus(item.id, 'approve')}>
                            承認
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => changeStatus(item.id, 'reject')}>
                            拒否
                        </button>
                        <button
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => changeStatus(item.id, 'pending')}>
                            審査中に戻す
                        </button>
                    </div>
                </div>
            ))}

            {/* ページネーション */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
                >
                    前へ
                </button>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
                >
                    次へ
                </button>
            </div>
        </div>
    );
}

export default AuthTableComponent;
