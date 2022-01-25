import "./App.css";
import { render } from "react-dom";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Gathering from "./components/Gathering";
import GatheringPostView from "./components/GatheringPostView";
import GatheringAdd from "./components/GatheringAdd";
import Best from "./components/Best";
import BestPostView from "./components/BestPostView";
import BestAdd from "./components/BestAdd";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import axios from "axios";

function App() {
  /*const [todayTitle, setTodayTitle]=useState('일정1');
  const [date, setDate]=useState('날짜');*/
  const [visible, setVisible] = useState(false);
  /*const renderTitles=todayTitle.map((val)=>{
    return(
      <div>{val.todayTitle}</div>
    );
  })*/
  //console.log(todayTitle);

  const [bests, setBests] = useState([]);
  useEffect(() => {
    axios
      .get("dummy/best_list.json")
      .then((res) => setBests(res.data.bestList))
      .catch((err) => console.log(err));
  }, []);

  const [gatherings, setGatherings] = useState([]);
  useEffect(() => {
    axios
      .get("dummy/gathering_list.json")
      .then((res) => setGatherings(res.data.gatheringList))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navbar></Navbar>}></Route>
        <Route path="/signin" element={<LoginPage></LoginPage>}></Route>
        <Route path="/signup" element={<RegisterPage></RegisterPage>}></Route>
        <Route path="/best" element={<Best component={bests}></Best>}></Route>
        <Route path="/bestAdd" element={<BestAdd></BestAdd>}></Route>
        <Route
          path="/bestPostView/:bestNoCategory"
          element={<BestPostView component={bests}></BestPostView>}
        ></Route>
        <Route
          path="/gathering"
          element={<Gathering component={gatherings}></Gathering>}
        ></Route>
        <Route
          path="/gatheringAdd"
          element={<GatheringAdd></GatheringAdd>}
        ></Route>
        <Route
          path="/gatheringPostView/:gatheringNoCategory"
          element={
            <GatheringPostView component={gatherings}></GatheringPostView>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
