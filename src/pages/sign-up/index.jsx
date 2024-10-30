import "styles/login.css";

export default function Login() {
    return (
      <div className="login-container">
        <div className="background-image">
          <div className="login-box">
            <div className="welcome-message">
              <h2>아직,</h2>
              <h1>SoundPin 회원이 아니세요?</h1>
              <button className="signup-button">회원가입</button>
            </div>
            <form className="login-form">
              <label htmlFor="username">아이디 *</label>
              <input type="text" id="username" placeholder="아이디를 입력하세요" required />
              <label htmlFor="password">비밀번호 *</label>
              <input type="password" id="password" placeholder="비밀번호를 입력하세요" required />
              <div className="login-options">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">로그인 저장</label>
              </div>
              <button type="submit" className="login-button">로그인</button>
            </form>
          </div>
        </div>
      </div>
    );
  }