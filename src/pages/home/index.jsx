import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/home.css";
import axios from "axios";
import api from "services/api";

export default function Home() {
  const [fadeOut, setFadeOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
    }, 850);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/api/playlistItems/${searchQuery}`,
      headers: {},
    };

    try {
      const response = await axios(config); // 서버에 요청 전송
      const data = response.data;
      console.log("API 응답:", data);

      if (data.success) {
        localStorage.setItem("guestData", JSON.stringify(data.data)); // 서버로부터 받은 데이터를 저장
        navigate("/Guest"); // /Guest 페이지로 이동
      } else {
        toast.error("유효하지 않은 핀 번호입니다.");
      }
    } catch (error) {
      console.error("핀 데이터를 불러오는 중 오류 발생:", error);
      toast.error("서버와의 통신에 실패했습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      localStorage.setItem("pin", searchQuery);
      handleSearch();
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className={`fade-overlay ${fadeOut ? "fade-out" : ""}`} />
      <div className="containerhome">
        <img
          src="/images/soundpin.png"
          alt="SoundPin Logo"
          className="home-logo"
        />
        <div className="search-bar-home">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Link to="/login" className="login-link">
          guest 말고 owner로 시작하기
        </Link>
      </div>
    </div>
  );
}
