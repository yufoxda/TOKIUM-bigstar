const SpendRequestForm = () => {
    return (
        <div className="w-full h-full flex flex-col">
            {/* 入力フォームヘッダー */}
            <div className="h-fit flex-none text-3xl p-2">
                アクションによって変更
            </div>
            {/* 入力フォームボディ */}
            <form>
            <div className="flex-grow h-full overflow-hidden flex">
                {/* 画像のアップロードおよびプレビュー機能を実装したい */}
                <div className="w-1/2 min-w-fit p-4">
                    <input type="file" name="example" accept="img/jpg, img/png"></input>
                </div>
                {/* ------------------------- */}
                <div className="w-1/2 p-4 overflow-y-auto">
                    <div className="mb-4 flex flex-row">
                        <div className="w-1/2">
                            <button class="bg-blue-400 text-white">Googleカレンダーから入力</button>
                        </div>
                        <div className="w-1/2 self-center">
                            <p>何個目の経費か</p>
                        </div>
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
                            <label className="text-xl block text-gray-800">支払先<span className="text-red-600 text-base">*</span></label>
                            <div className="mt-1">
                                <input type="text" name="example-required-input"  className="inputcss"/>
                            </div>
                        </div>
                        <div className="my-2">
                            <label className="text-xl block text-gray-800">経費科目<span className="text-red-600 text-base">*</span></label>
                            <div className="mt-1">
                                <input type="text" name="example-required-input" className="inputcss"/>
                            </div>
                        </div>
                        <div className="my-2">
                            <label className="text-xl block text-gray-800">目的<span className="text-red-600 text-base">*</span></label>
                            <div className="mt-1">
                                <input type="text" name="example-required-input"  className="inputcss"/>
                            </div>
                        </div>
                        <div className="my-2">
                            <label className="text-xl block text-gray-800">的確請求書番号</label>
                            <div className="mt-1">
                                <input type="text" name="example-text-input"  className="inputcss"/>
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
             
            </form>
            {/* 入力フォームフッター */}
            <div className="h-12 flex-none bottom-0 flex items-center justify-end bg-gray-100 px-5">
                <div className="flex gap-4 px-2">
                <button className="bg-red-500 text-white px-4 py-2">キャンセル</button>
                    <button className="bg-green-500 text-white px-4 py-2">新規作成</button>
                </div>
            </div>
        </div>
    )
}

export default SpendRequestForm;
