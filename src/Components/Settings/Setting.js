import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function Settings() {
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);

  let obj = {
    wallet: stateAddress.address,
  };
  const handleApiBuyinfoBracket = async () => {
    const apiReS = await axios.post(
      "https://api.1lab.network/api/auth/dapp",

      {
        wallet: "0xf916b5302b5e06fec2925c914eb86549899fc877",
        sign: "0x1b169ad457be1ac262c16baab847755484820e9c9cb2827e3f442c90f37bd7b56d35cf0034d1ce86124c69835770b689e88cc11e804f1a3db9d5f930d46ae38d1b",
      },
      { withCredentials: true }
    );

    console.log("Api Auth buyInfo Brack res", apiReS);
  };

  const handleApiBuyInfo = async () => {
    const apiReS = await axios.post("https://api.1lab.network/api/buyinfo", {
      obj,
      withCredentials: true,
    });
    console.log("ApiBuyInfo Credential res", apiReS.data);
  };

  const handleAuthPost = async () => {
    const apiReS = await axios.post(
      "https://api.1lab.network/api/buyinfo",
      { wallet: stateAddress.address, withCredentials: true }
      // {withCredentials:true}
    );
    console.log("ApiAuth Credential res", apiReS.data);
  };

  const handleBuyInfo = async () => {
    const buyInfRes = await axios.get("https://api.1lab.network/api/buyinfo");

    console.log("buyInfo", buyInfRes.data);
  };

  const handleBuyInfoCrd = async () => {
    const buyInfRes = await axios.get("https://api.1lab.network/api/buyinfo", {
      withCredentials: true,
    });

    console.log("buyInfoCred res", buyInfRes.data);
  };
  return (
    <div className="flex justify-center bg-[#141627] h-[1000px]">
      <h1 className="text-white text-center mt-10">
        <div className="m-5 p-2">
          <button className="m-5 p-2" onClick={handleApiBuyinfoBracket}>
            AuthApp Post
          </button>
          <button className="m-5 p-2" onClick={handleApiBuyInfo}>
            AuthAppCrd
          </button>
          <button className="m-5 p-2" onClick={handleBuyInfo}>
            BuyInfo
          </button>
          <button className="m-5 p-2" onClick={handleBuyInfoCrd}>
            BuyInfoCrd
          </button>
          <button className="m-5 p-2" onClick={handleAuthPost}>
            AuthAppCrdPost
          </button>
          {/* Settings */}
        </div>
      </h1>
    </div>
  );
}

export default Settings;
