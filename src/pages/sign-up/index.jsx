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
       <div class="content-left">
        <div><p>그럼, <br/><b>SoundPin</b> 회원이 <br/>되어볼까요?</p></div>
      </div>
      <div class="vertical-line"></div>
      <div class="content-right">
        <div className="inputGroup">
            <label> 아이디 <span style={{ color: '#be0000' }}>*</span></label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label>비밀번호 <span style={{ color: '#be0000' }}>*</span></label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label>비밀번호 재입력 <span style={{ color: '#be0000' }}>*</span></label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="input"
            />
          </div>
          <button onClick={handleLogin} className="loginButton">로그인</button>
      </div>
    </div>
  );
}

export default LoginPage;
