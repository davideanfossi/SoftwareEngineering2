//import logo from './logo.svg';
import './App.css';
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./components/organism/home";
import { Layout } from "./components/organism/layout";
import { InsertHike } from "./components/organism/InsertHike";
import { InsertHut } from "./components/organism/InsertHut";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { EmailActivate } from './components/emailActivate';
import { useEffect, useState } from "react";
import API from './API'

import { UserContext } from "./context/user-context";

function App() {
  const [user, setUser] = useState({
    id: undefined,
    role: undefined,
    user: undefined,
  });

  useEffect(() => {
    API.getUserInfo()
    .then((user) => { 
      setUser({
          id: user.id,
          role: user.role,
          user: user.username
      });
    })
    .catch((err) => {
      setUser({
          id: undefined,
          role: undefined,
          user: undefined,
        });
    })
  }, []);

  const value = { user, setUser };
  return (
    <UserContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="inserthut" element={<InsertHut/>} />
            {["Local Guide"].includes(user.role) && (
              <Route path="insert-hike" element={<InsertHike />} />
            )}
            <Route path="register" index element={<Register register={API.registerUser}/>} />
            <Route path="login" index element={<Login/>} />
            <Route path='authentication/activate/*' index element={<EmailActivate/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
