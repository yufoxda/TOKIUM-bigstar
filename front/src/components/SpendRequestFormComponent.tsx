import react from 'react';


/*
---DB input--------
- 利用日
- 金額
- 支払先
- 経費科目
- 目的
- 的確請求書番号
- 連絡請求番号
- メモ
- image_place
---action button-----
- calender連携ボタン
- 申請ボタン
- キャンセルボタン

- 許可ボタン
- 不許可ボタン
*/

const SpendRequestForm = () =>{
    return (
        <div className="w-screen bg-red-300">
            <div className="h-1/6 bg-red-300">入力フォーム</div>

            <div className="h-4/6 bg-blue-300 flex">
                <div className="bg-teal-100 w-1/2">left</div>
                <div className="bg-teal-400 w-1/2">right</div>
            </div>
            <div className="h-1/6 bg-green-300">申請ボタンなど</div>
        </div>
    )
}

export default SpendRequestForm