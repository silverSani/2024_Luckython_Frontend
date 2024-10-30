import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import "styles/home.css";

export default function Home() {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFadeOut(true);
        }, 850);
    }, []);

    return (<div><div className={`fade-overlay ${fadeOut ? "fade-out" : ""}`} />

        <div className="containerhome">
            <img src="/images/soundpin.png" alt="SoundPin Logo" className="logo" />
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <Link to="/login" className="login-link">
                guest 말고 owner로 시작하기
            </Link>
        </div></div>
    );
}
