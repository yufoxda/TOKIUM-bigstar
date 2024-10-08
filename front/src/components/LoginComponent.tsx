import axios from 'axios';
import React from 'react';
import { GoogleLogin } from 'react-google-login';

const LoginComponent: React.FC = () => {
  const handleSuccess = async (response: any) => {
    const tokenId = response.tokenId;
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/google_oauth2', {
        id_token: tokenId,
      });
      const { jwt, user } = res.data;
      console.log('JWT:', jwt);
      console.log('User:', user);
      // ここでJWTを保存し、アプリ内で使用します
      localStorage.setItem('authToken', jwt);

    } catch (error) {
      console.error('Googleログインに失敗しました', error);
    }
  };

  const handleFailure = (error: any) => {
    console.error('Googleログインエラー', error);
  };

  console.log(process.env.REDIRECT_URI)
  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Googleでログイン"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      redirectUri={process.env.REDIRECT_URI}
    />
  );
};

export default LoginComponent;
