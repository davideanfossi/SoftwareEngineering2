//import logo from './logo.svg';
import './App.css';
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./Components/home";
import { Layout } from "./Components/layout";
import { Login } from "./Components/Login"
import { Register } from './Components/Register';
import { useState } from 'react';
import API from './API'

function App() {
  const [user, setUser] = useState(undefined);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user}/>}>
          <Route index element={<Home />} />
          <Route path="register" index element={<Register register={API.registerUser}/>} />
        <Route path="login" index element={<Login setUser={setUser}/>} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;
