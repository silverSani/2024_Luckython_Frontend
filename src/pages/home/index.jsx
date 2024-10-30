import { Link } from "react-router-dom"

export default function Home(){


    return (
        <div class="container">
        <h1 class="logo">SoundP<span class="icon">i</span>n</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <Link to="/login">
            guest 말고 owner로 시작하기
        </Link>
      </div>)
}