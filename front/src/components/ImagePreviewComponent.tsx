import React from "react";


export const ImagePreviewComponent =({base64image})=> {
    return(
        <div>
            {base64image ? 
            (<div className="w-full h-96">
                <img src={base64image} className="w-full max-h-96" alt="画像はありません" />
            </div>) :
            <div className="w-full h-96 bg-gray-300 border-dashed border-4 border-gray-600 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-file-earmark-image" viewBox="0 0 16 16">
                    <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                    <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z"/>
                </svg>
            </div>}
        </div>
    )
}