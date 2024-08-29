import { render } from "@testing-library/react";
import React, { useRef, useState,useEffect } from "react";

// 一枚の画像をアップロードする用のコンポーネント

// 関数コンポーネント
export const ImageFormComponent = () => {
    const [base64Image,setBase64Image]=useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null);
    let input_style :string ='is-visible'
    const [isVisible,setIsVisible]=useState<boolean>(true)

    useEffect(()=>{
        console.log("useEffectが呼ばれました")
        resetInput()
    },[])

    // 送信ボタンを押した時に発火する関数
    const handleSubmit =(e: React.FormEvent) => {
        e.preventDefault()
        console.log("画像を送信しました！")
        resetInput()
    }

    // 画像、inputタグをリセットする関数
    const resetInput = () => {
        console.log('resetInputが呼ばれました')
        if (inputRef.current){
            inputRef.current.value=''
        }
        setBase64Image(null)
        input_style='is-visible'
    }

    // ブラウザバック時にinputタグをリセットする
    window.addEventListener('unload',resetInput)
    
    // ファイルが新たに選択された時に発火する関数 
    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handleInputFileが呼ばれました！")
        const files=e.target.files; // html要素からinputタグのfilesを取得
        input_style='is-hidden'

        
        if (base64Image){
            window.alert("選択できるが画像は1枚までです")
            return
        }

        if(!files){
            // ファイルが選択されていない場合は何もしない
            return
        };

        const reader = new FileReader();
        reader.onloadend = () =>{
            const result = reader.result;
            console.log(result);
            setBase64Image(result as string)
        }
        reader.readAsDataURL(files[0])
        console.log(base64Image)
    }


    return (
        {console.log("renderが呼ばれました")}
        <form className="flex flex-col items-center mt-2 border border-black-2">
            <h1>画像をアップロード</h1>
            {/* プレビュー部分 */}
            <div className="prev-img-container">
                {base64Image ? (
                    <div className="prev-img-box">
                        <img src={base64Image} className="prev-img" alt="Preview" />
                    </div>) : <span className="mdi mdi-image"></span>}
            </div>
            <div>
                <input type="file" accept="image/jpeg, image/png" onChange={handleInputFile} ref={inputRef}/>
                <button type='submit' onClick={handleSubmit}>送信</button>
            </div>
        </form>
    
    ) 

};

