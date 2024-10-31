import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/login.css";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const apiUrl = process.env.REACT_APP_BACKEND_API_URL;
    // //이건 연결되면 지우셈
    // setTimeout(() => {
    //   navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    // }, 500);

    //--서버연결--
    // 빈칸 확인
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("모두 입력해주세요.");
      return;
    }

    // 한글 입력 확인
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(username) || koreanRegex.test(password)) {
      toast.error("한글은 입력할 수 없습니다.");
      return;
    }

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("회원가입 성공!");
        setTimeout(() => {
          navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
        }, 500); // 성공 메시지 후 1초 후 이동
      } else {
        if (data.message === "Username already exists") {
          toast.error("이미 존재하는 아이디입니다.");
        } else {
          toast.error("회원가입 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      toast.error("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="content-left">
        <div>
          <p>
            그럼, <br />
            <b>SoundPin</b> 회원이 <br />
            되어볼까요?
          </p>
        </div>
      </div>
      <div className="vertical-line"></div>
      <div className="content-right">
        <div className="inputGroup">
          <label>
            {" "}
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
        <div className="inputGroup">
          <label>
            비밀번호 재입력 <span style={{ color: "#be0000" }}>*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
          />
        </div>
        <button onClick={handleSignUp} className="loginButton">
          회원가입
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
