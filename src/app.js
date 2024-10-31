import { Route, Routes } from "react-router-dom";

import Home from "pages/home";
import Login from "pages/login";
import SignUp from "pages/sign-up";
import Owner from "pages/ownerPage/Owner";
import OwnerPlaylist from "pages/ownerPage/OwnerPlaylist";
import LoginBase from "layouts/LoginBase";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route element={<LoginBase />}>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
      </Route>
      <Route path="/Owner" element={<Owner />}></Route>
      <Route path="/OwnerPlaylist" element={<OwnerPlaylist />}></Route> 
    </Routes>
  );
}
