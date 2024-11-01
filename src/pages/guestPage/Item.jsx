import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "styles/login.css";

function LoginPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [position, setPosition] = useState(1); // Default position as number
  const [playlistId, setPlaylistId] = useState("PLCnwzD94RuGCzkz-_VKsDK1KJ8ecc3U7L");
  const navigate = useNavigate();

  // Load saved username and position on page load
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
    const pos = Number(localStorage.getItem("len")) || 1; 
    setPosition(pos || 1); // Set to 1 if pos is null or undefined
  }, []);

  const addPlaylistItem = async (videoUrl, playlistId, position) => {
    console.log("here");
    console.log(videoUrl, playlistId, position);
    let data = JSON.stringify({
      "playlistId": playlistId,
      "videoUrl": videoUrl,
      "position": position
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://3.36.76.110:8080/api/playlistItems',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSliderChange = (event) => {
    setPosition(event.target.valueAsNumber); // Ensure it stays as a number
  };

  return (
    <div className="login-container">
      <div className="container">
        <ToastContainer />
        <div className="content-left">
          <div>
            <p>
              노래를 <br />
              <b>추가해</b>
              볼까요?
            </p>
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="content-right">
          <div className="inputGroup">
            <label>
              Youtube Video Url <span style={{ color: "#be0000" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="ex) https://www.youtube.com/watch?v=??"
              onChange={(e) => setVideoUrl(e.target.value)}
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="numeric-slider"> 몇 번에 넣을 건가요? </label>
            <div style={{ padding: '5px', textAlign: 'left' }}>
              <input
                type="range"
                min={1}
                max={4} // 여기 고쳐야 함
                value={position} // `position` is now a number
                onChange={handleSliderChange}
                style={{ width: '100%' }}
              />
            </div>
            <label> {position} 번 </label>
          </div>
          <button
            onClick={(event) => {
              event.preventDefault(); // Prevent default form submission behavior
              addPlaylistItem(videoUrl, playlistId, position-1);
              navigate("/Guest");
            }}
            className="loginButton"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
