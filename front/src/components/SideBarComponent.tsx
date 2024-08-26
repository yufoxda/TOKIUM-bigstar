
interface Item {
    id: string;
    date: string;
    amount: number;
  }

const itemList : Item[]=[
    "承認待ち1",
    "承認待ち2",
    "承認済み1",
    
]

//  className="fixed top-0 left-0 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar"
//  className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col gap-1"

const SideBar = () =>{
    return (
        <div className="w-80 px-3 h-full bg-gray-200 ">
            <div className="my-5 w-full flex justify-center">
                <button className="bg-yellow-300  w-64">新規作成</button>
            </div>
            
            <div className=" h-overflow-y-hidden">
            {(() => {
                const items = [];
                // items.push(<button className="bg-yellow-300">新規作成</button>)
                for (let i = 0; i < itemList.length; i++) {
                    items.push(<button className="h-28 w-full flex justify-between items-center shadow rounded cursor-pointer border border-transparent">{itemList[i]}</button>)
                }
                return (
                    <ul className="space-y-5 font-medium">
                        {items}
                    </ul>
                );
            })()}
            </div>
        </div>
        // <div className="w-96 bg-blue-100"><p>aaa</p></div>

    )
}

export default SideBar
