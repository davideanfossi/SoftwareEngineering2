//import logo from './logo.svg';
import './App.css';
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./components/organism/home";
import { Layout } from "./components/organism/layout";
import { InsertHike } from "./components/organism/InsertHike";
import { Login } from "./Components/Login"
import { Register } from './Components/Register';
import { EmailActivate } from './Components/emailActivate';
import { useState, useEffect } from 'react';
import API from './API'


function App() {
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  // use effect: get userInfo
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (error) {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // login
  const handleLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setLoggedIn(true);
      console.log(user);
      setUser(user);
    } catch (err) {
      throw err;
    }
  };

  // logout
  const handleLogout = async () => {
    try {
      await API.logout();
      setLoggedIn(false);
      setUser(undefined);
    } catch (err) {
        throw err;
    }
  };

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user}/>}>
          <Route index element={<Home />} />
          <Route path="register" index element={<Register register={API.registerUser}/>} />
          <Route path="login" index element={<Login login={handleLogin}/>} />
          <Route path='authentication/activate/*' index element={<EmailActivate/>}/>
          <Route path="insert-hike" element={<InsertHike/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;
