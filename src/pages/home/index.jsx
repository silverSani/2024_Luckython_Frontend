import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/home.css";

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
    const apiUrl = process.env.REACT_APP_BACKEND_API_URL;
    if (!searchQuery.trim()) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/users/{pin}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("검색 결과를 찾았습니다!");
        navigate(`/owner/${data.pageName}`);
      } else {
        // 서버 연결 성공했지만 응답이 실패한 경우
        const data = await response.json();
        if (data.message === "No results found") {
          toast.error("검색 결과를 찾을 수 없습니다.");
        } else {
          toast.error("검색 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      // 서버 연결 자체가 실패한 경우
      toast.error("서버 연결에 실패했습니다.");
      console.error("서버 연결에 실패했습니다.", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className={`fade-overlay ${fadeOut ? "fade-out" : ""}`} />
      <div className="containerhome">
        <img src="/images/soundpin.png" alt="SoundPin Logo" className="logo" />
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
