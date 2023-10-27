import React, { useState ,useEffect } from "react";
import { CardsData } from "./Dashboard/data";
import { useSelector } from "react-redux";
import Web3 from "web3";
import config from "../config.json"

function DashboardMobileCards(props) {
  const [ogiBUSD, setOgiBUSD] = useState("");
  const [ethBUSD, setEthBUSD] = useState("");
  const [gemBUSD, setGemBUSD] = useState("");
  const [tvlGem, setTvlGem] = useState("");
  const [OGIHold, setOGIHold] = useState("");
  const [NFTHold, setNFTHold] = useState("");

  const { ethereum } = window;
  const web3 = new Web3(ethereum);

  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const Gems = useSelector((state) => state.rootReducer.wallet.gems);
  const wallet = useSelector((state) => state?.rootReducer?.wallet?.wallet);
  const ogi = useSelector((state) => state?.rootReducer?.wallet?.ogi);
  console.log('ogi',ogi);
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address?.address
  );

  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );

  const handleOGIBUSD = async () => {
    const GemWalletHold = await NFTContract.methods.count().call();
    setNFTHold(GemWalletHold);
    const OgiWalletHold = await OGITokens.methods.count().call();
    setOGIHold(OgiWalletHold);

    const tvlGems = await NFTContract.methods.getTVL().call();
    const tvlEth = web3.utils.fromWei(tvlGems, "ether");
    console.log("tvlGems", tvlGems);
    if (tvlEth.toString().includes(".")) {
      setTvlGem(tvlEth.toString().slice(0, 5));
    } else {
      console.log(tvlEth.toString() + "..");
      setTvlGem(tvlEth.slice(0, 4));
    }

    console.log("OGI IN BUSD", ogi.ogi);
    if(ogi.ogi == 0)
    {
      setOgiBUSD("0");
    }
    else{
      let val = web3.utils.toWei(ogi.ogi.toString(), "ether");
      const OGItoBNB = await PancakeRouter.methods
        .getAmountsIn(val, [
          config.BNBToken.toString(),
          config.OGIToken.toString(),
        ])
        .call();
      console.log("OGI TO BNB", OGItoBNB);
  
      const BNBtoBUSD = await PancakeRouter.methods
        .getAmountsOut(OGItoBNB[0], [
          config.BNBToken.toString(),
          config.BUSDToken.toString(),
        ])
        .call();
      console.log("BNBtoBUSD", BNBtoBUSD);
      const BNBtoBUSDEth = web3.utils.fromWei(BNBtoBUSD[1].toString(), "ether");
      // debugger
      console.log("BUSDEth", BNBtoBUSDEth);
      setOgiBUSD(BNBtoBUSDEth);
    }
    // console.log('Val',web3.utils.fromWei(ogi.ogi.toString(), "wei"));
   
  };

  const handleGemBUSD = async () => {
    const GemVal = Gems.gems * 10;
    console.log("Gem Val", GemVal);
    console.log("Wei value", web3.utils.toWei(GemVal.toString(), "ether"));
    
    const OGItoBNBGem = await PancakeRouter.methods
      .getAmountsIn(web3.utils.toWei(GemVal.toString(), "ether"), [
        config.BNBToken.toString(),
        config.OGIToken.toString(),
      ])
      .call();

    const BNBtoBUSDGem = await PancakeRouter.methods
      .getAmountsOut(OGItoBNBGem[0], [
        config.BNBToken.toString(),
        config.BUSDToken.toString(),
      ])
      .call();
    const BNBtoBUSDEth = web3.utils.fromWei(BNBtoBUSDGem[1], "ether");
    setGemBUSD(BNBtoBUSDEth);
    console.log(BNBtoBUSDEth);
  };

  const handleEthBUSD = async () => {
    const val = await web3.eth.getBalance(stateAddress);
    //  console.log('Val in Wei',val);
    const BNBtoBUSDeth = await PancakeRouter.methods
      .getAmountsOut(val, [
        config.BNBToken.toString(),
        config.BUSDToken.toString(),
      ])
      .call();
    const BUSEDeth = web3.utils.fromWei(BNBtoBUSDeth[1], "ether");
    console.log('BUSEDeth',BUSEDeth);
    let bnbUsdRate;
    async function convertBnbToUsd(BUSEDeth) {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
        const data = await response.json();
        console.log('data',data);
        bnbUsdRate = parseFloat(data.price);
        console.log('bnbUsdRates',bnbUsdRate);
        const result=BUSEDeth/bnbUsdRate
        console.log('result',result);
        setEthBUSD(result.toString());
        // const usdAmount = BUSEDeth * bnbUsdRate;
        // console.log('usdAmount',usdAmount);
        // return usdAmount.toFixed(2);
      } catch (error) {
        console.error(error);
      }
    }
    convertBnbToUsd(BUSEDeth);
    
  };
  console.log('EthBUSD',ethBUSD);

  useEffect(() => {
    handleOGIBUSD();
  }, [ogiBUSD]);
  useEffect(() => {
    handleOGIBUSD();
    handleGemBUSD();
    handleEthBUSD();
  }, [stateAddress]);


  return (
    <div>
      <div className="max-w-[130vw] ">
        <div className="grid grid-cols-1  py-6 md:px-8 lg:px-6  xl:px-16">
          <div className="row-span-1 rounded-[10px] ">
            <div className="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-1 lg:grid-cols-3 ">
              {CardsData.map((item) => {
                // const {bg}  = item.bg;
                return (
                  <div key={item.id}>
                    {item.id === 3 ? (
                      <>
                        <div className=" bg-[#41445F36] rounded-[10px] m-4 p-2 bg-cardImg2 bg-cover">
                          {/* <img src={item.bg} alt="imageBG" className="h-[200px] relative " /> */}

                          <div className="flex ">
                            <div className="text-white h-[210px] ml-[20px] md:ml-[10px] ">
                              <div className="mt-[30px]">
                                {!sign.sign ? (
                                  <>
                                    <p className="font-bold text-[35px] ">
                                      N/A
                                      <span className="text-[35px] font-thin">
                                        {item.title}
                                      </span>
                                    </p>
                                    <p className=" text-[16px] mt-4">
                                      {item.description}
                                    </p>
                                    <p className="  text-[14px] text-gray-400 ">
                                      Equivalent to $N/A
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-semibold text-[30px] md:text-[30px]  lg:text-[30px]">
                                      {/* {wallet.map((val)=><>{val.wallet}</>)} */}
                                      {wallet?.wallet?.includes(".")
                                        ? wallet.wallet?.substring(0, 7)
                                        : wallet.wallet}
                                      <span className="text-[30px] font-thin md:text-[30px]  lg:text-[30px]">
                                        {item.title}
                                      </span>
                                    </p>
                                    <p className=" text-[16px] mt-4  md:w-[100px] lg:text-[16px] lg:w-[100px]">
                                      {item.description}
                                    </p>
                                    <p className="  text-[14px] text-gray-400  ">
                                      Equivalent to ${ethBUSD.substring(0, 15)}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-white mt-[60px] m-10  ml-auto">
                              <img
                                src={item.image}
                                alt="imageBG"
                                className={`mr-5 md:ml-14 lg:ml-1 lg:mt-6 xl:mt-0 h-[90px] w-[90px]`}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className=" bg-[#41445F36] rounded-[10px] m-4 p-2 bg-cardImg bg-cover">
                          {/* <img src={item.bg} alt="imageBG" className="h-[200px] relative " /> */}

                          <div className="flex ">
                            <div className="text-white h-[210px]  ml-[20px]  ">
                              <div className="mt-2">
                                {item.id == 1 && sign.sign && stateAddress ? (
                                  <>
                                    <p className="m-0 text-[40px] font-bold lg:text-[30px] xl:text-[40px]">
                                      {ogi.ogi.includes(".")
                                        ? ogi.ogi.substring(0, 6)
                                        : ogi.ogi}
                                    </p>
                                    <p className="m-0 font-sans text-[24px]  lg:text-[18px] xl:text-[25px]">
                                      {item.title}
                                    </p>
                                    <p className="m-0 text-[16px]  lg:text-[12px] xl:text-[16px]">
                                      {item.description}
                                    </p>
                                    <p className="text-[14px] text-gray-400  ">
                                      Equivalent to ${ogiBUSD.slice(0, 10)}
                                    </p>
                                  </>
                                ) : item.id == 2 &&
                                  sign.sign &&
                                  stateAddress ? (
                                  <>
                                    <p className="m-0 text-[40px] font-bold ">
                                      {Gems.gems}
                                    </p>
                                    <p className="m-0 font-sans text-[24px]  ">
                                      {item.title}
                                    </p>
                                    <p className="m-0 text-[16px] ">
                                      {item.description}
                                    </p>
                                    <p className="text-[14px] text-gray-400  ">
                                      Equivalent to $
                                      {Gems.gems == 0
                                        ? "0"
                                        : gemBUSD.substring(0, 10)}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="m-0 text-[40px] font-bold ">
                                      N/A
                                    </p>
                                    <p className="m-0 font-sans text-[24px]  ">
                                      {item.title}
                                    </p>
                                    <p className="m-0 text-[16px] ">
                                      {item.description}
                                    </p>
                                    <p className="text-[14px] text-gray-400  ">
                                      Equivalent to N/A
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-white mt-4 lg:mt-12 xl:mt-4 ml-auto">
                              <img
                                src={item.image}
                                alt="imageBG"
                                className={``}
                              />
                              {/* 
                              <button
                                className="w-[80px] h-[40px] rounded-[10px] ml-6 text-center 
                            bg-gradient-to-r  from-light-violet to-regal-blue"
                              >
                                {item.btn_text}
                              </button> */}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMobileCards;
