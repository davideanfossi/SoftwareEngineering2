//import logo from './logo.svg';
import './App.css';
import "./main.scss";
import "react-range-slider-input/dist/style.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Home } from "./components/organism/home";
import { Layout } from "./components/organism/layout";
import { InsertParking } from "./components/organism/insertParking";
import { InsertHike } from "./components/organism/InsertHike";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { EmailActivate } from './components/emailActivate';
import { useEffect, useState } from "react";
import API from './API'
import { LinkStartEnd } from './components/organism/LinkStartEnd';

import { UserContext } from "./context/user-context";
import { MyHikes } from './components/organism/my-hikes';
import { SearchHut } from './components/organism/searchHut';

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
            {["Local Guide"].includes(user.role) && (
              <>
                <Route path="insert-hike" element={<InsertHike />} />
                <Route path="my-hikes" element={<MyHikes />} />
                <Route path="insertparking" element={<InsertParking />} />
              </>
            )}
            {["Local Guide", "Hiker", "Hut Worker"].includes(user.role) &&
              <Route path="search-hut" element={<SearchHut />} />
            }
            <Route path="register" index element={<Register register={API.registerUser}/>} />
            <Route path="login" index element={<Login/>} />
            <Route path='authentication/activate/*' index element={<EmailActivate/>}/>

            <Route path='link-start-end/:id' index element={<LinkStartEnd/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
