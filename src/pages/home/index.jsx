import { Link } from "react-router-dom"

export default function Home(){


    return (<div>대충 홈화면이라 생각
        <Link to="/login">
            guest 말고 owner로 시작하기
        </Link>
    </div>)
}