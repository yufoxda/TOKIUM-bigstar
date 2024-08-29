import React, { useState } from "react";
import { useExportCsv } from "../hooks/useExportCsv";

interface Props {
  keihis: SpendRequest[];
}

interface SpendRequestItem {
  amount: number; // 金額
  usageDate: string; // 利用日（ISO 8601形式の文字列として表現される場合）
  expenseCategory: string; // 経費科目（オプション）
  // 他のプロパティがあればここに追加
}

interface SpendRequest {
  userId: string; // user_id（一般的に文字列として表現される）
  status: string; // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
  spendTo: string; // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
  createdAt: string; // created_at（ISO 8601形式の文字列として表現される場合）
  updatedAt: string; // updated_at（ISO 8601形式の文字列として表現される場合）
  spendRequestItems: SpendRequestItem[]; // spend_request_item（配列型でSpendRequestItemオブジェクトのリスト）
}


/* 経費合計の計算をする関数 */
function calculateTotalAmount(items: SpendRequestItem[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

/* created_atをフォーマットする*/
function formatCreatedAt(created_at: string): string {
  const datas = created_at.split("-");
  return datas[0] + "年" + datas[1] + "月" + datas[2].slice(0, 2) + "日";
}

const SideBar = ({ keihis, setIs_create, setdetail_id, onButtonClick }) => {
  const [showPending, setShowPending] = useState(false);
  const {exportCsv} = useExportCsv();

  const filteredKeihis = showPending
    ? keihis.filter(
        (item) => item.status === "pending" || item.status === "wait"
      )
    : keihis;

  const to_detail = (id) => {
    console.log(id);
    setIs_create(false); // 詳細表示に変更
    setdetail_id(id);
    onButtonClick(id);
  };

  const to_create = () => {
    setIs_create(true); // 新規作成に変更
    setdetail_id(null);
  };

  return (
    <div className="w-80 px-3 h-full bg-gray-200 flex flex-col">
        <button type="button" onClick={to_create} className="bg-yellow-300 w-64 h-14 my-3 mx-auto">
          新規作成
        </button>
      <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={showPending}
              onChange={() => setShowPending(!showPending)}
            />
            <span className="ml-2 text-gray-700">未承認のみ</span>
          </label>
      <div className="h-full overflow-hidden ">
        <div className="pr-0.5 overflow-y-auto overflow-x-hidden h-full space-y-5 font-medium rounded">
          {filteredKeihis.map((item) => (
            <button
              type="button"
              key={item.id}
              id={item.id}
              onClick={() => to_detail(item.id)}
              className="h-28 w-full flex justify-between items-center shadow rounded cursor-pointer border border-transparent"
            >
              <div className="w-full flex flex-col">
                <div className="w-full flex flex-row">
                  <div className="w-1/3">{item.status}</div>
                  <div className="w-full right-0">
                    {formatCreatedAt(item.created_at)}
                  </div>
                </div>
                <div className="w-full flex flex-row">
                  <div className="w-1/3 truncate">{item.spend_to}</div>
                  <div className="w-full right-0">
                    {calculateTotalAmount(item.spend_request_item)}円
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button className="bg-gray-300  w-64 h-14 my-3 mx-auto flex items-center" onClick={exportCsv}>
          <div className="w-fit mx-auto inline-flex items-center">
            <svg class="w-6 h-6 text-gray-800 dark:text-white bg-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"/>
            </svg>
            <span className="">csv出力</span>
          </div>
          
        </button>
    </div>
  );
};

export default SideBar;
