import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "styles/login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // 페이지 로드시 저장된 아이디 불러오기
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    const apiUrl = process.env.REACT_APP_BACKEND_API_URL;
    //이건 연결되면 지우셈
    setTimeout(() => {
      navigate("/Owner"); // 성공 후 이동할 경로
    }, 500); // 성공 메시지 후 1초 뒤 이동

    //--서버연결--

    // if (!username.trim() || !password.trim()) {
    //   // 입력 필드 빈칸 검증
    //   toast.error("모두 입력해주세요.");
    //   return;
    // }

    // try {
    //   const response = await fetch(`${apiUrl}/api/users`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     toast.success("로그인 성공!");
    //     console.log("로그인 성공:", data);

    //     if (rememberMe) {
    //       localStorage.setItem("rememberedUsername", username);
    //     } else {
    //       localStorage.removeItem("rememberedUsername");
    //     }

    //     setTimeout(() => {
    //       navigate("/"); // 성공 후 이동할 경로
    //     }, 500); // 성공 메시지 후 1초 뒤 이동
    //   } else {
    //     if (data.message === "Invalid credentials") {
    //       toast.error("아이디 또는 비밀번호가 잘못되었습니다.");
    //     } else {
    //       toast.error("로그인 중 오류가 발생했습니다.");
    //     }
    //   }
    // } catch (error) {
    //   toast.error("서버 연결에 실패했습니다.");
    // }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="content-left">
        <div>
          <p>
            아직, <br />
            <b>SoundPin</b> 회원이 <br />
            아니세요?
          </p>
        </div>
        <div>
          <button
            className="signupButton"
            onClick={() => (window.location.href = "/sign-up")}
          >
            회원가입
          </button>
        </div>
      </div>
      <div className="vertical-line"></div>
      <div className="content-right">
        <div className="inputGroup">
          <label>
            아이디 <span style={{ color: "#be0000" }}>*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
        </div>
        <div className="inputGroup">
          <label>
            비밀번호 <span style={{ color: "#be0000" }}>*</span>
          </label>
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
        <button onClick={handleLogin} className="loginButton">
          로그인
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
