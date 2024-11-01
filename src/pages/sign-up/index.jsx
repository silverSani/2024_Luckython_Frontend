import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "services/api";
import "react-toastify/dist/ReactToastify.css";
import "styles/login.css";

function SignUpPage() {
  const [step, setStep] = useState(1); // 현재 단계
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleNextStep = () => {
    // 첫 번째 페이지 유효성 검사
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("모두 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    const numericOnlyRegex = /^[0-9]+$/;
    if (numericOnlyRegex.test(username)) {
      toast.error("아이디는 숫자로만 이루어질 수 없습니다.");
      return;
    }
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(username) || koreanRegex.test(password)) {
      toast.error("한글은 입력할 수 없습니다.");
      return;
    }
    setStep(2);
  };

  const handleSignUp = () => {
    // 모든 입력 데이터 유효성 검사
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/user/signUp",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: username,
        password: password,
        nickname: nickname,
        bio: bio,
      },
    };

    // 서버 요청
    api
      .request(config)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          toast.success("회원가입 성공!");
          navigate("/login");
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.message === "Username already exists"
        ) {
          toast.error("이미 존재하는 아이디입니다.");
        } else {
          toast.error("서버 연결에 실패했습니다.");
        }
      });
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
        {step === 1 ? (
          <>
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
            <div className="inputGroup">
              <label>비밀번호 재입력 *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
              />
            </div>
            <button onClick={handleNextStep} className="loginButton">
              다음
            </button>
          </>
        ) : (
          <>
            <div className="inputGroup">
              <label>닉네임 *</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input"
              />
            </div>
            <div className="inputGroup">
              <label>소개 문구</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input"
              />
            </div>
            <button onClick={handleSignUp} className="loginButton">
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUpPage;
