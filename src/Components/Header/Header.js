import React, { useState } from "react";
import Profile from "../Dashboard/Profile";
import { AiOutlineBell } from "react-icons/ai";
import ConnectMetaMask from "../MetaMask/ConnectMetaMask";
import { useLocation } from "react-router-dom";
import Drawer from "./Drawer";

function Header({ active }) {
  const { pathname } = useLocation();
  const value = localStorage.getItem("active");
  console.log("Dashboard value", value);
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 xl:grid-cols-2   border-b-2   border-[#dee0ff36]'>
        {/* <div className="hidden md:block"> */}
        <div className='flex items-center mt-[-55px] md:hidden lg:hidden xl:hidden w-0'>
          <Drawer /> <span className="font-bold text-white text-2xl">DA</span>
        </div>
        <div className='order-first md:order-last lg:order-last xl:order-last  flex justify-end md:ml-[-30px] lg:ml-[-30px] xl:ml-[-30px] text-white'>
          <button
            className='px-2 md:px-4 h-[40px] rounded-[10px] mt-10 mb-2 text-center 
              bg-gradient-to-r  from-light-violet to-regal-blue'
          >
            See Charts
          </button>

          <div className='mt-12'>
            <div className='mx-2 sm:mx-7'>
              <AiOutlineBell size={25} color='#CC00FF' />
            </div>
          </div>
          <ConnectMetaMask />
        </div>

        <div className='text-2xl font-semibold text-white  md:mt-10 lg:mt-10 ml-5'>
          {/* <p>Dashboard</p> */}
          {pathname === "/" ? (
            <p>Dashboard</p>
          ) : pathname === "/LiquidityPool" ? (
            <p>Liquidity Pool</p>
          ) : pathname === "/Staking" ? (
            <p>Staking</p>
          ) : pathname === "/GemVault" ? (
            <p>Gem Vault</p>
          ) : pathname === "/Settings" ? (
            <p>Settings</p>
          ) : (
            ""
          )}
        </div>
        {/* </div> */}
      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}

export default Header;
