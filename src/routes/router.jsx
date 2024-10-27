import {Route, Routes} from 'react-router-dom'

import Home from "routes/home"
import Login from "routes/login"

export default function Router(){

    return (
        <Routes>
            <Route path="/" element={<Home/>}> </Route>
            <Route path="/login" element={<Login/>}> </Route>
        </Routes>
    )
}
