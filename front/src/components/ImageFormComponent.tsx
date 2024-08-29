import { render } from "@testing-library/react";
import React, { useRef, useState,useEffect } from "react";

// 一枚の画像をアップロードする用のコンポーネント

// 関数コンポーネント
export const ImageFormComponent = () => {
    const [base64Image,setBase64Image]=useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(()=>{
        console.log("useEffectが呼ばれました")
        resetInput()
    },[])


    // 画像、inputタグをリセットする関数
    const resetInput = () => {
        console.log('resetInputが呼ばれました')
        if (inputRef.current){
            inputRef.current.value=''
        }
        setBase64Image(null)
    }

    // ブラウザバック時にinputタグをリセットする
    window.addEventListener('unload',resetInput)
    
    // ファイルが新たに選択された時に発火する関数 
    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handleInputFileが呼ばれました！")
        const files=e.target.files; // html要素からinputタグのfilesを取得

        if(!files){
            // ファイルが選択されていない場合は何もしない
            return
        };

    
        const reader = new FileReader();
        reader.onloadend = () =>{
            const result = reader.result;
            setBase64Image(result as string)
        }
        reader.readAsDataURL(files[0])
        console.log(base64Image)
    }


    return (
        <form className="flex flex-col items-center mt-2">
            {/* プレビュー部分 */}
            <p>領収書画像を添付してください</p>
            {base64Image ? (
                <div className="prev-img-box">
                    <img src={base64Image} className="prev-img" alt="Preview" />
                </div>) :
                <div className="w-full h-96 bg-gray-300 border-dashed border-4 border-gray-600 flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-file-earmark-image" viewBox="0 0 16 16">
                        <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                        <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z"/>
                    </svg>
                </div>}
            <input type="file" accept="image/jpeg, image/png" onChange={handleInputFile} ref={inputRef} className="left-2 mt-2"/>

        </form>
    
    ) 

};

