import { Outlet } from "react-router-dom"

import "styles/layout.css"

export default function LoginBase({children = <Outlet></Outlet>}) {
    return (
      <div className="background-image">
        <div className="login-container">
          {children}
        </div>
      </div>
    );
  }