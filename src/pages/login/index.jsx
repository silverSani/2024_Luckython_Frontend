import React, { useState } from 'react';

import "styles/login.css";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // 로그인 처리 로직 작성
    console.log('아이디:', username);
    console.log('비밀번호:', password);
    console.log('로그인 저장:', rememberMe);
  };

  return (
    <div className="container">
      <div className="signupContainer">
        <p>아직, <br/><b>SoundPin</b> 회원이 아니세요?</p>
        <button className="signupButton">회원가입</button>
      </div>
      <div className="loginContainer">
        <div className="inputGroup">
          <label>아이디 *</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="input"
          />
        </div>
        <div className="inputGroup">
          <label>비밀번호 *</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="input"
          />
        </div>
        <div className="checkboxContainer">
          <input 
            type="checkbox" 
            checked={rememberMe} 
            onChange={(e) => setRememberMe(e.target.checked)} 
          />
          <label>로그인 저장</label>
        </div>
        <button onClick={handleLogin} className="loginButton">로그인</button>
      </div>
    </div>
  );
}

export default LoginPage;
