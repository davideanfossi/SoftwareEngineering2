import "./App.css";
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./components/organism/home";
import { Layout } from "./components/organism/layout";
import { InsertParking } from "./components/organism/insertParking";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="insertparking" element={<InsertParking />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
