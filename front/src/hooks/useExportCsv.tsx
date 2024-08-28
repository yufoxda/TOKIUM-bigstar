import axios from 'axios';
import { useAuth } from './useAuth';

export const useExportCsv = () => {
    const { currentUser, token } = useAuth();

    const exportCsv = async (params: any) => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/keihi/export/csv', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    user_id: currentUser.id,
                    ...params
                },
                responseType: 'arraybuffer', // レスポンスをバイナリデータとして受け取る
            });

            // レスポンスヘッダーからファイル名を取得
            const disposition = response.headers['content-disposition'];
            const fileName = `keihi_${currentUser.id}.csv`;

            // ArrayBufferを文字列に変換してBlobを作成
            const utf8Decoder = new TextDecoder('utf-8');
            const decodedData = utf8Decoder.decode(new Uint8Array(response.data));
            const blob = new Blob([decodedData], { type: 'text/csv;charset=utf-8' });

            // BlobからURLを作成
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // ファイル名を設定
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // メモリを解放
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    };

    return { exportCsv };
};
