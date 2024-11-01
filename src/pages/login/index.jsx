import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "services/api";
import "../../styles/item.css";
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

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      toast.error("모두 입력해주세요.");
      return;
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/user/signIn",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: username,
        password: password,
      },
    };

    api
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          toast.success("로그인 성공!");

          if (rememberMe) {
            localStorage.setItem("rememberedUsername", username);
          } else {
            localStorage.removeItem("rememberedUsername");
          }

          setTimeout(() => {
            navigate("/Owner");
          }, 500);
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.message === "Invalid credentials"
        ) {
          toast.error("아이디 또는 비밀번호가 잘못되었습니다.");
        } else {
          toast.error("서버 연결에 실패했습니다.");
          console.error("로그인 중 오류 발생:", error);
        }
      });
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
