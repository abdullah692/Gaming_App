import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import { CardsData, contentData } from "./Components/Dashboard/data";
import { Routes, Route } from "react-router-dom";
import LiquidityPool from "./Components/LiquidityPool/LiquidityPool";
import Settings from "./Components/Settings/Setting";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import Header from "./Components/Header/Header";
import { useState, useEffect } from "react";
import {
  LiquidityData,
  MyGemsData,
  MarketGemsData,
} from "./Components/LiquidityPool/data";
import Staking from "./Components/Staking/Staking";
import GemVault from "./Components/GemVault/GemVault";
import { StakingData, StackGemRewarded } from "./Components/Staking/data";
import { GemVaultData } from "./Components/GemVault/data";
import { initGA, logPageView } from "./analytics";
import { useLocation } from "react-router-dom";

function App() {
  const [active, setActive] = useState(1);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("active", active);
  }, [active]);

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

  return (
    <div className='App'>
      <Sidebar active={active} setActive={setActive}>
        <div className='p-0 md:pl-[70px] md:pr-[70px] lg:pl-[70px] lg:pr-[70px]  bg-[#141627] '>
          <Header active={active} />
        </div>
        <Routes>
          <Route
            exact
            path='/'
            element={
              <Dashboard CardsData={CardsData} contentData={contentData} />
            }
          />
          <Route
            path='/LiquidityPool'
            element={
              <LiquidityPool
                LiquidityData={LiquidityData}
                MyGemsData={MyGemsData}
                MarketGemsData={MarketGemsData}
              />
            }
          />
          <Route
            path='/Staking'
            element={
              <Staking
                StakingData={StakingData}
                StackGemRewarded={StackGemRewarded}
              />
            }
          />
          <Route
            path='/GemVault'
            element={<GemVault GemVaultData={GemVaultData} />}
          />
          <Route path='/Settings' element={<Settings />} />
        </Routes>
      </Sidebar>
      {/* <Dashboard CardsData={CardsData} contentData={contentData}/> */}
    </div>
  );
}

export default App;
