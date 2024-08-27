import mockData from '../../mockdata'   // モックデータの読み込み


interface Props {
    keihis: SpendRequest[];
}

interface SpendRequestItem {
    amount: number;          // 金額
    usageDate: string;       // 利用日（ISO 8601形式の文字列として表現される場合）
    expenseCategory: string; // 経費科目（オプション）
    // 他のプロパティがあればここに追加
  }
  
  interface SpendRequest {
    userId: string;          // user_id（一般的に文字列として表現される）
    status: string;          // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
    spendTo: string;         // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
    createdAt: string;       // created_at（ISO 8601形式の文字列として表現される場合）
    updatedAt: string;       // updated_at（ISO 8601形式の文字列として表現される場合）
    spendRequestItems: SpendRequestItem[]; // spend_request_item（配列型でSpendRequestItemオブジェクトのリスト）
  }

/* モックデータ */
const itemList : SpendRequest[]=[
    {   
        userId: "A0001",
        status: "申請中",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "電車",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "札幌行きタクシー",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 2000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    {   
        userId: "A0001",
        status: "承認待ち",       // status（文字列型。必要に応じてリテラル型や列挙型にすることも可能）
        spendTo: "ハワイ行き飛行機",      // spend_to（文字列型。具体的な内容に応じて変更するかもしれません）
        createdAt: "2024-7-2",       // created_at（ISO 8601形式の文字列として表現される場合）
        updatedAt: "2024-7-2",       // updated_at（ISO 8601形式の文字列として表現される場合）
        spendRequestItems:
        [
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "行き",
            },
            {
                amount: 1000,
                usageDate: "2024-8-30",
                expenseCategory: "帰り",
            }
        ]
    },
    
]

/* 経費合計の計算をする関数 */
function calculateTotalAmount(items: SpendRequestItem[]): number {
    return items.reduce((total, item) => total + item.amount, 0);
}

/* 状態をフォーマットする */
// function formatStatus(status: string):string{
//     if(status==="pending"){
//         return "申請中"
//     }
//     else if(status==="")
//     return
// }

/* created_atをフォーマットする*/
function formatCreatedAt(created_at: string):string{
    const datas=created_at.split('-')
    return datas[0]+'年'+datas[1]+'月'+datas[2].slice(0,2)+'日'
}


const SideBar = ({keihis,setIs_create,setdetail_id}) =>{
    
    const to_detail = (id) => {
        setIs_create(false); // 詳細表示に変更
        setdetail_id(id);
        console.log(id);
    };
      
    const to_create = () => {
    setIs_create(true); // 新規作成に変更
    setdetail_id(null);
    };

    return (
        <div className="w-80  px-3 h-full bg-gray-200 flex flex-col">
            <div className="h-fit my-5 w-full flex justify-center">
                <button type="button" onClick={to_create} className="bg-yellow-300  w-64">新規作成</button>
            </div>
            <div className="h-full overflow-hidden">
            {(() => {
                const items = [];
                // console.log(keihis[0].id)
                // items.push(<button className="bg-yellow-300">新規作成</button>)
                for (let i = 0; i < keihis.length; i++) {
                    items.push(
                    <button type="button" onClick={() => to_detail(keihis[i].id)} className="h-28 w-full flex justify-between items-center shadow rounded cursor-pointer border border-transparent">
                        <div className="w-full flex flex-col">
                            <div className="w-full flex flex-row">
                                <div className="w-1/3">
                                    {keihis[i].status}
                                </div>
                                <div className="w-full right-0">
                                    {formatCreatedAt(keihis[i].created_at)}
                                </div>
                            </div>
                            <div className="w-full flex flex-row">
                                <div className="w-1/3 truncate ">
                                  {keihis[i].spend_to}
                                </div>
                                <div className="w-full right-0">
                                    {calculateTotalAmount(keihis[i].spend_request_item)}円
                                   
                                </div>
                            </div>
                        </div>
                        </button>)
                }
                return (
                    <div className=" overflow-y-auto h-full space-y-5 font-medium ">
                        {items}
                    </div>
                );
            })()}
            </div>
        </div>

    )
}

export default SideBar
