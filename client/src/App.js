import logo from './logo.svg';
import './App.css';
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./components/home";
import { Layout } from "./components/layout";
import { LoginForm } from "./Components/Login"
import { Register } from './Components/Register';

function App() {
  return (
    //<LoginForm />
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;
