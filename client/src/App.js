//import logo from './logo.svg';
import './App.css';
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./Components/home";
import { Layout } from "./Components/layout";
import { Login } from "./Components/login"
import { Register } from './Components/register';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" index element={<Register />} />
        <Route path="login" index element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;
