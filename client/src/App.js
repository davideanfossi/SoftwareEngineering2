import "./App.css";
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./components/organism/home";
import { Layout } from "./components/organism/layout";
import { InsertHike } from "./components/organism/InsertHike";
import { InsertHut } from "./components/organism/InsertHut";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="inserthut" element={<InsertHut/>} />
            <Route path="insert-hike" element={<InsertHike/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
