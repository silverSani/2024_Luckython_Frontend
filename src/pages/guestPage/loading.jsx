import React from "react";
import "../../styles/loading.css"; // 새 스타일 파일을 생성합니다.

function Loading() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default Loading;
