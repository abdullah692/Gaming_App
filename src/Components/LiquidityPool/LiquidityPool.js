import React, { useState, useEffect } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { FiRepeat } from "react-icons/fi";
import Saga from "../Saga/Saga";
import { SagaNos } from "./data";
import Model from "./Model";
import { SellGems } from "./data";
import BuyGems from "./BuyGems";
import { useSelector, useDispatch } from "react-redux";
import Web3 from "web3";
import config from "../../config.json";
import Gem1 from "../../assets/images/Gem1.png";
import Gem2 from "../../assets/images/Gemlvl6.png";
import Gem4 from "../../assets/images/Gemlvl4.png";
import Gem16 from "../../assets/images/Gemlvl16.png";
import bg2 from "../../assets/images/bglvl06.png";
import bg4 from "../../assets/images/bglvl4.png";
import bg16 from "../../assets/images/bglvl16.png";
import bg1 from "../../assets/images/bg1.png";
import SellGem from "./SellGem";
import { BsTag } from "react-icons/bs";
import LevelUp from "./levelUp";
import { HashLoader, GridLoader } from "react-spinners";
import LiquidityAndVaultData from "../LiquidityAndVaultData";
import { CustomNotification } from "../../utils/Notification";
import BN from "bn.js";
import DashboardMobileCards from "../DashboardMobileCards";
import { BNBBuy } from "../../utils/BUSDGems";
import { storeBNBSell, storeBUSDSell } from "../reduxtoolkit/smartContract";
// import bigInt from 'big-integer';
// import BigNumber from "bignumber.js";

const imagesForLevel = {
  level1: Gem1,
  level2: Gem2,
  level3: Gem4,
  level4: Gem16,
};

const imagesForLevelBg = {
  level1: bg1,
  level2: bg2,
  level3: bg4,
  level4: bg16,
};

function LiquidityPool({ LiquidityData, MyGemsData, MarketGemsData }) {
  const [show, setShow] = useState(false);
  const [marketGems, setMarketGems] = useState([]);
  const [myGems, setMyGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [merge, setMerge] = useState([]);
  const [sellValues, setSellValues] = useState([]);
  const [buyValues, setBuyValues] = useState([]);
  const dispatch = useDispatch();

  const wallet = useSelector((state) => state?.rootReducer?.wallet?.wallet);
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const myGemsWallet = useSelector(
    (state) => state?.rootReducer?.wallet?.myGemsWallet?.myGemsWallet
  );
  const marketGemsWallet = useSelector(
    (state) => state?.rootReducer?.wallet?.marketGemsWallet?.marketGemsWallet
  );
  console.log("Market Gems Wallet", marketGemsWallet);
  const myGemSell = useSelector(
    (state) => state?.rootReducer?.wallet?.myGemSell.myGemSell
  );
  console.log("mySellGemasasas", myGemSell);
  const BuyValue = useSelector(
    (state) => state?.rootReducer?.wallet?.buyValue.buyValue
  );
  const SellValue = useSelector(
    (state) => state?.rootReducer?.wallet?.sellValue.sellValue
  );
  const ogi = useSelector((state) => state?.rootReducer?.wallet?.ogi);

  // console.log("Market gdadsds", marketGemsWallet);
  const arr = [];
  const saga = useSelector((state) => state?.rootReducer?.saga);
  const OGI = useSelector((state) => state.rootReducer.wallet.ogi);
  const Gems = useSelector((state) => state.rootReducer.wallet.gems);
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const loadingForAgainFetch = useSelector(
    (state) => state?.rootReducer?.wallet?.loadingForAgainFetch
  );
  console.log(loadingForAgainFetch, "loadingForAgainFetch");
  // const ogiBUSDSell = useSelector(
  //   (state) => state?.rootReducer?.wallet?.BUSD?.ogiBUSD
  // );
  // console.log('ogiBusdSell',ogiBUSDSell);

  const ogiBNBBuy = useSelector(
    (state) => state?.rootReducer?.wallet?.BNBBuy?.ogiBNBBuy
  );
  console.log("BNB Buy", ogiBNBBuy);
  const ogiBUSDBuy = useSelector(
    (state) => state?.rootReducer?.wallet?.BUSDBuy?.ogiBUSDBuy
  );
  console.log("BUSD Buy", ogiBUSDBuy);

  const ogiBNBSell = useSelector(
    (state) => state?.rootReducer?.wallet?.BNBSell?.ogiBNBSell
  );
  console.log("BNBSell", ogiBNBSell);

  const ogiBUSDSell = useSelector(
    (state) => state?.rootReducer?.wallet?.BUSDSell?.ogiBUSDSell
  );
  console.log("BUSDSell", ogiBUSDSell);

  const { ethereum } = window;
  const web3 = new Web3(ethereum);

  const handleModel = (key) => {
    arr.push(key);

    setShow(true);
  };
  const LSSVMRouterTokens = new web3.eth.Contract(
    config.LSSVMRouterABI,
    config.LSSVMRouterToken
  );

  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );

  // const BNBSell = async (size) => {
  //   try {
  //     console.log('size',size);
  //     const getSellValue = await LSSVMRouterTokens.methods
  //       .getSellPairCost([[config.PairCostToken, ["1"]]])
  //       .call();
  //     console.log("GetSellValue", getSellValue);
  //     let result = (
  //       Math.pow(2, size-1) * getSellValue
  //     )
  //     console.log('result',result);

  //     const BNBToken = config.BNBToken;
  //     const OGIToken = config.OGIToken;
  //     const OGItoBNB = await PancakeRouter.methods
  //       .getAmountsOut(result,[BNBToken, config.BUSDToken])
  //       .call();
  //       const OGItoBNBEth = web3.utils.fromWei(OGItoBNB[1], "ether");
  //       // dispatch(
  //       //   storeBNBSell({
  //       //     ogiBNBSell: OGItoBNBEth,
  //       //   })
  //       // );
  //     console.log("OGITOBNB", OGItoBNB);

  //     const BNBtoBUSD = await PancakeRouter.methods
  //     .getAmountsOut(OGItoBNB[1], [
  //       config.BUSDToken.toString(),
  //       config.BNBToken.toString(),
  //       config.OGIToken.toString(),
  //     ]).call();
  //     console.log("BNBtoBUSD", BNBtoBUSD);
  //     const BNBtoBUSDEth = web3.utils.fromWei(BNBtoBUSD[2], "ether");
  //     console.log("ogiBUSDaaaa", BNBtoBUSDEth);
  //     // dispatch(
  //     //   storeBUSDSell({
  //     //     ogiBUSDSell: BNBtoBUSDEth,
  //     //   })
  //     // );
  //     return {
  //       OGItoBNBEth,
  //       BNBtoBUSDEth
  //     };
  //     // setOgiBUSD(BNBtoBUSDEth);
  //   } catch (error) {
  //     console.log("Error Message", error);
  //   }
  // };
  const BNBSell = async (id) => {
    try {
      debugger
      const NFTLevel=await LSSVMRouterTokens.methods
      .getPairByTokenId(config.NFTToken,id).call();
      console.log('NFTLevel Address',NFTLevel);

      const getSellValue = await LSSVMRouterTokens.methods
        .getSellPairCost([[NFTLevel, ["1"]]])
        .call();
      console.log("GetSellValue", getSellValue);
      // let result = (Math.pow(2, size - 1) * getSellValue).toString();
      // console.log("result", result);
      // const val = web3.utils.toWei(getSellValue, "ether");

      const BNBToken = config.BNBToken;
      const OGIToken = config.OGIToken;
      const OGItoBNB = await PancakeRouter.methods
        .getAmountsOut(getSellValue, [BNBToken, config.BUSDToken])
        .call();
      const OGItoBNBEth = web3.utils.fromWei(OGItoBNB[1], "ether");
      // dispatch(
      //   storeBNBSell({
      //     ogiBNBSell: OGItoBNBEth,
      //   })
      // );
      console.log("OGITOBNB", OGItoBNB);

      const BNBtoBUSD = await PancakeRouter.methods
        .getAmountsOut(OGItoBNB[1], [
          config.BUSDToken.toString(),
          config.BNBToken.toString(),
          config.OGIToken.toString(),
        ])
        .call();
      console.log("BNBtoBUSD", BNBtoBUSD);
      const BNBtoBUSDEth = web3.utils.fromWei(BNBtoBUSD[2], "ether");
      console.log("ogiBUSDaaaa", BNBtoBUSDEth);
      // dispatch(
      //   storeBUSDSell({
      //     ogiBUSDSell: BNBtoBUSDEth,
      //   })
      // );
      return {
        OGItoBNBEth,
        BNBtoBUSDEth,
      };
      // setOgiBUSD(BNBtoBUSDEth);
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  const BNBBuy = async (id) => {
    try {
      const NFTLevel=await LSSVMRouterTokens.methods
      .getPairByTokenId(config.NFTToken,id).call();
      console.log('NFTLevel Address',NFTLevel);

      const getBuyValue = await LSSVMRouterTokens.methods
        .getBuyPairCost([[NFTLevel, ["1"]]], 2)
        .call();
      //   let result = (Math.pow(2, size - 1) * getBuyValue).toString();
      // console.log("resultBuy", result);
      console.log("GetBuyValue", getBuyValue);
      const BNBToken = config.BNBToken;
      const OGIToken = config.OGIToken;

      const OGItoBNB = await PancakeRouter.methods
        .getAmountsOut(getBuyValue, [BNBToken, config.BUSDToken])
        .call();
      const OGItoBNBEthBuy = web3.utils.fromWei(OGItoBNB[1], "ether");
      // dispatch(
      //   storeBNBBuy({
      //     ogiBNBBuy: OGItoBNBEth,
      //   })
      // );
      // console.log('bnb Buy',OGItoBNBEth);

      const BNBtoBUSD = await PancakeRouter.methods
        .getAmountsOut(OGItoBNB[1], [
          config.BUSDToken.toString(),
          config.BNBToken.toString(),
          config.OGIToken.toString(),
        ])
        .call();
      console.log("BNBtoBUSD", BNBtoBUSD);
      const BNBtoBUSDEthBuy = web3.utils.fromWei(BNBtoBUSD[2], "ether");
      // console.log("ogiBUSDaaaa", BNBtoBUSDEth);
      // dispatch(
      //   storeBUSDBuy({
      //     ogiBUSDBuy: BNBtoBUSDEth,
      //   })
      // );
      return {
        OGItoBNBEthBuy,
        BNBtoBUSDEthBuy,
      };
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  // For production only
  // function filteredSaga() {
  //   const value = myGemSell?.filter((val) => {
  //     return val.generation == saga.sagaMyGems;
  //   });
  //   setMyGems(value);
  //   console.log("The final value Saga", value);
  // }

  function filteredSaga() {
    console.log(myGemsWallet, "myGemsWallet:fs");
    const value = myGemsWallet?.filter((val) => {
      return val.generation == saga.sagaMyGems;
    });
    setMyGems(value);
    console.log("The final value Saga", value);
  }

  function filteredSagaForMarket() {
    console.log(marketGemsWallet, "marketGemsWallet:fsM");
    const value = marketGemsWallet?.filter((val) => {
      return val.generation == saga.sagaMarketGems;
    });
    setMarketGems(value);
    setMerge([]);
    console.log("The final value Saga Market", value);
  }

  const handleClick = (event, item) => {
    console.log(" handle Click Ids", item);
    console.log("Merge,", merge);
    event.stopPropagation();
    // debugger
    const isExist = merge.find((eachData) => eachData.id === item.id);
    console.log("isExist", isExist);
    if (merge.length <= 2 || (!isExist && merge.length < 2)) {
      if (merge.length < 2 && !isExist) {
        let a = true;
        if (merge.length !== 0 && item?.size !== merge[0]?.size) {
          CustomNotification("error", "Please select the same level of Gems");
          a = false;
          return;
        }
        // });
        if (a) {
          setMerge([...merge, item]);
        }
      } else {
        const filtered = merge.filter((val) => val.id !== item.id);
        console.log("Filtered", filtered);
        setMerge(filtered);
        console.log("Id is already included");
      }
    } else {
      // CustomNotification("error", "You can only select two NFTs", )
      console.log("Already have two ids");
    }
  };

  useEffect(() => {
    console.log("MERGE: ", merge);
  }, [merge]);

  useEffect(() => {
    setLoading(true);
    if (myGemsWallet?.length > 0) {
      // setTimeout(()=>{
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [stateAddress.address, myGemsWallet, myGemSell]);

  useEffect(() => {
    filteredSaga();
  }, [saga.sagaMyGems, myGemsWallet, myGemSell, loadingForAgainFetch]);
  useEffect(() => {
    filteredSagaForMarket();
  }, [
    saga.sagaMarketGems,
    marketGemsWallet,
    myGemsWallet,
    myGemSell,
    sign.sign,
    loadingForAgainFetch,
  ]);

  // useEffect(() => {
  //   async function fetchSellValues() {
  //     const newSellValues = {};
  //     for (const item of myGems) {
  //       const result = await BNBSell(item.id);
  //       newSellValues[item.id] = {
  //         ogiBNBSellVal: result.OGItoBNBEth,
  //         ogiBUSDSellVal: result.BNBtoBUSDEth,
  //       };
  //       console.log("newSellValues", newSellValues);
  //     }
  //     setSellValues(newSellValues);
  //   }
  //   fetchSellValues();
  // }, [myGems]);

  useEffect(() => {
    async function fetchSellValues() {
      const promises = myGems.map(async (item) => {
        const result = await BNBSell(item.id);
        return {
          id: item.id,
          ogiBNBSellVal: result.OGItoBNBEth,
          ogiBUSDSellVal: result.BNBtoBUSDEth,
        };
      });
      console.log('promisses',promises);

      const newBuyValues = {};
      const results = await Promise.all(promises);
      for (const result of results) {
        newBuyValues[result.id] = {
          ogiBNBSellVal: result.ogiBNBSellVal,
          ogiBUSDSellVal: result.ogiBUSDSellVal,
        };
      }
      console.log('newBuyValues',newBuyValues);
      setSellValues(newBuyValues);
    }
    
    fetchSellValues();
  }, [myGems]);

  // useEffect(() => {
  //   async function fetchSellValues() {
  //     const newBuyValues = {};
  //     for (const item of marketGems) {
  //       const result = await BNBBuy(item.id);
  //       newBuyValues[item.id] = {
  //         ogiBNBBuyVal: result.OGItoBNBEthBuy,
  //         ogiBUSDBuyVal: result.BNBtoBUSDEthBuy,
  //       };
  //       console.log("newBuyValues", newBuyValues);
  //     }
  //     setBuyValues(newBuyValues);
  //   }
  //   fetchSellValues();
  // }, [marketGems]);

  useEffect(() => {
    async function fetchSellValues() {
      const promises = marketGems.map(async (item) => {
        const result = await BNBBuy(item.id);
        return {
          id: item.id,
          ogiBNBBuyVal: result.OGItoBNBEthBuy,
          ogiBUSDBuyVal: result.BNBtoBUSDEthBuy,
        };
      });
      
      const newBuyValues = {};
      const results = await Promise.all(promises);
      for (const result of results) {
        newBuyValues[result.id] = {
          ogiBNBBuyVal: result.ogiBNBBuyVal,
          ogiBUSDBuyVal: result.ogiBUSDBuyVal,
        };
      }
      
      setBuyValues(newBuyValues);
    }
    
    fetchSellValues();
  }, [marketGems]);

  return (
    <div className=" bg-[#141627] text-white h-[calc(100vh-90px)] overflow-auto ">
      <div className="block  md:hidden">
        <DashboardMobileCards />
      </div>
      <div className="hidden md:block">
        <div className="max-w-[130vw] ">
          <LiquidityAndVaultData />
        </div>
      </div>

      <div className="grid grid-cols-1 py-6 px-4 md:px-16 lg:px-16 xl:px-16">
        <div className="flex  border-b-2 border-gray-500 py-2">
          <div>
            <p className="font-medium text-[25px]">My Gems</p>
            <p className="text-[16px]">Select two gems of the same level to level them up!</p> 
            </div>
        </div>
        <div className="flex justify-end mt-[-60px]">
          <div>{merge.length == 2 ? <LevelUp merge={merge} /> : ""}</div>
          <button>
            <p className="flex border-2 border-white px-4 rounded-[5px]">
              <Saga Saga={SagaNos} val="sagaMyGems" />
              <span className="mt-[3px] ml-2">
                <RiArrowDownSLine />
              </span>
            </p>
          </button>
        </div>
      </div>

      <div>
        {!sign.sign ? (
          <>
            <div className="text-[18px] font-medium  mb-[50px] py-6   px-16 ">
              Please Connect to wallet first ..
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-6   px-4 md:px-16 lg:px-16 xl:px-16 gap-5 lg:gap-5  md:gap-10 xl:gap-10 ">
            {
              myGems?.length == 0 ? (
                <>
                  <div className="text-[18px] font-medium  mb-[50px]">
                    No NFTs to show ..
                  </div>
                </>
              ) : loading == true && myGems?.length > 0 ? (
                <div className="col-span-3 mb-[150px] mt-6 flex justify-center">
                  <HashLoader color="#560871" size={90} />
                </div>
              ) : (
                myGems?.map((item, index) => {
                  const sellValue = sellValues[item.id];
                  console.log(
                    "sellValue?.ogiBUSDSellVal",
                    sellValue?.ogiBUSDSellVal
                  );
                  // const result = BNBSell(item.size);
                  // console.log('results',result);
                  // const ogiBNBSellVal = result.OGItoBNBEth;
                  // console.log('ogiBNBSellVal',ogiBNBSellVal);
                  // const ogiBUSDSellVal = result.BNBtoBUSDEth;

                  // let result = (
                  //   Math.pow(2, item.size - 1) * ogiBNBSell
                  // ).toString();
                  // let value = (
                  //   Math.pow(2, item.size - 1) * ogiBUSDSell
                  // ).toString();

                  return (
                    <div>
                      {merge.map((x) => x.id).includes(item.id) ? (
                        <>
                          <div
                            className="rounded-[10px] bg-cover cursor-pointer"
                            style={{
                              backgroundImage: item.level && imagesForLevelBg[`level${item.size}`]
                              ? `url(${imagesForLevelBg[`level${item.size}`]})`
                              : `url(${bg1})`,
                            }}
                            key={item.id}
                            onClick={(event) => handleClick(event, item)}
                          >
                            <div className="grid grid-cols-3 ">
                              {item.level &&
                              imagesForLevel[`level${item.size}`] ? (
                                <img
                                  src={imagesForLevel[`level${item.size}`]}
                                  alt="imageBG"
                                  className={` my-4  ml-[-12px] `}
                                />
                              ) : (
                                <img
                                  src={Gem1}
                                  alt="imageBG"
                                  className={` my-4  ml-[-12px] `}
                                />
                              )}

                              {/* <img
                                src={imagesForLevel[`level${item.level}`]}
                                alt="imageBG"
                                className={` my-4  ml-[-12px] `}
                              /> */}

                              <div className="mt-6 md:mt-6 lg:mt-4 xl:mt-8  ml-[-12px]">
                                <p className="font-medium text-[25px] md:text-[18px] lg:text-[20px] xl:text-[25px]">
                                  Level {item.size}
                                </p>
                                {!SellValue ? (
                                  <p className=" text-gray-400 text-[12px]">
                                    = $ N/A | =<span>$OGI N/A</span>
                                  </p>
                                ) : !sellValue?.ogiBNBSellVal ? (
                                  <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                    = $
                                    <GridLoader size={5} color="purple"/>
                                    {/* {result.includes(".")
                                      ? result.substring(0, 8)
                                      : result} */}
                                    | =
                                    <span>
                                      $OGI{" "}
                                      <GridLoader size={5} color="purple"/>
                                      {/* {value.includes(".")
                                          ? value.substring(0, 10)
                                          : value}{" "} */}
                                    </span>
                                  </p>
                                ):(
                                  <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                    = ${sellValue?.ogiBNBSellVal.slice(0, 10)}
                                    {/* {result.includes(".")
                                      ? result.substring(0, 8)
                                      : result} */}
                                    | =
                                    <span>
                                      $OGI{" "}
                                      {sellValue?.ogiBUSDSellVal.slice(0, 10)}
                                      {/* {value.includes(".")
                                          ? value.substring(0, 10)
                                          : value}{" "} */}
                                    </span>
                                  </p>
                                )
                                }

                                {/* <p>{item.id}</p> */}
                              </div>
                              <div className="pr-6 mt-12 ml-[-10px] md:ml-[-14px] lg:ml-[-10px] xl:ml-0">
                                {/* <LevelUp merge={merge} /> */}
                                <SellGem id={item.id} />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="rounded-[10px] bg-cover cursor-pointer opacity-50"
                            style={{
                              backgroundImage: item.level && imagesForLevelBg[`level${item.size}`]
                              ? `url(${imagesForLevelBg[`level${item.size}`]})`
                              : `url(${bg1})`,
                            }}
                            key={item.id}
                            onClick={(event) => handleClick(event, item)}
                          >
                            <div className="grid grid-cols-3 ">
                            {item.level &&
                              imagesForLevel[`level${item.size}`] ? (
                                <img
                                  src={imagesForLevel[`level${item.size}`]}
                                  alt="imageBG"
                                  className={` my-4  ml-[-12px] `}
                                />
                              ) : (
                                <img
                                  src={Gem1}
                                  alt="imageBG"
                                  className={` my-4  ml-[-12px] `}
                                />
                              )}
                             

                              <div className="mt-6 md:mt-6 lg:mt-4 xl:mt-8  ml-[-12px]">
                                <p className="font-medium text-[25px] md:text-[18px] lg:text-[20px] xl:text-[25px]">
                                  Level {item.size}
                                </p>
                                {!SellValue ? (
                                  <p className=" text-gray-400 text-[12px]">
                                    = $ N/A | =<span>$OGI N/A</span>
                                  </p>
                                ) : !sellValue?.ogiBNBSellVal ? (
                                  <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                    = $
                                    <GridLoader size={5} color="purple"/>
                                    {/* {result.includes(".")
                                      ? result.substring(0, 8)
                                      : result} */}
                                    | =
                                    <span>
                                      $OGI{" "}
                                      <GridLoader size={5} color="purple"/>
                                      {/* {value.includes(".")
                                          ? value.substring(0, 10)
                                          : value}{" "} */}
                                    </span>
                                  </p>
                                ):(
                                  <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                    = ${sellValue?.ogiBNBSellVal.slice(0, 10)}
                                    {/* {result.includes(".")
                                      ? result.substring(0, 8)
                                      : result} */}
                                    | =
                                    <span>
                                      $OGI{" "}
                                      {sellValue?.ogiBUSDSellVal.slice(0, 10)}
                                      {/* {value.includes(".")
                                          ? value.substring(0, 10)
                                          : value}{" "} */}
                                    </span>
                                  </p>
                                )
                              }
                                
                              </div>
                              <div className="pr-6  ml-[-10px] md:ml-[-14px] lg:ml-[-10px] xl:ml-0">
                                {/* <button
                                  className="border-[1px] border-gray-300 rounded-[10px] px-3 md:px-1 lg:px-1 xl:px-3  md:text-[10px] lg:text-[14px]  py-[2px] my-5 flex"
                                  // onMouseDown={(event) => handleLevel(item.id,event)}
                                >
                                  <FiRepeat className="m-[4px]" />
                                  LevelUp
                                </button> */}
                                {/* <LevelUp merge={merge}/> */}
                                {/* </div> */}
                                {/* <button
                      className="border-[1px] border-gray-300 rounded-[10px] px-[25px]  py-[2px]  flex  "
                      onClick={(event) => handleModel(index)}
                      key={index}
                    >
                      <BsTag className="m-[4px]" />
                      Sell
                    </button> */}
                                <button
                                  className="border-[1px] mt-12 border-gray-300 rounded-[10px] md:px-2 lg:px-3 xl:px-6  px-[25px] md:text-[10px] lg:text-[14px]   py-[2px]  flex  "
                                  // onClick={() => handleSellLinearCurve(id)}
                                  // key={index}
                                >
                                  <BsTag className="m-[4px]" />
                                  Sell
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )

              // {show ? (
              //   <>
              //     <Model
              //       show={show}
              //       onClose={() => setShow(false)}
              //       SellGems={SellGems}
              //     />
              //   </>
              // ) : null}
              // {show
              //   ? (document.body.style.overflow = "hidden")
              //   : (document.body.style.overflow = "")}
            }
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 py-6 px-4 md:px-16 lg:px-16 xl:px-16 ">
        <div className="flex justify-between border-b-2 border-gray-500 py-2">
          <div className=" font-medium text-[25px]">Market Gems </div>

          <button>
            <p className="flex border-2 border-white px-4 rounded-[5px] ">
              <Saga Saga={SagaNos} val="sagaMarketGems" />
              <span className="mt-[3px] ml-2">
                <RiArrowDownSLine />
              </span>
            </p>
          </button>
        </div>
      </div>

      <div>
        {!sign.sign ? (
          <div className="text-[18px] font-medium  mb-[50px] py-6   px-16 ">
            Please Connect to wallet first ..
          </div>
        ) : (
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-3 py-6   px-4 md:px-16 lg:px-16 xl:px-16  lg:gap-5  md:gap-10 xl:gap-10 ">
            {marketGems?.length == 0 ? (
              <>
                <div className="text-[18px] font-medium mb-[150px]">
                  No NFTs to show ..
                </div>
              </>
            ) : loading == true && marketGems?.length > 0 ? (
              <div className="col-span-3 mb-[150px] mt-6 flex justify-center">
                <HashLoader color="#560871" size={90} />
              </div>
            ) : (
              marketGems?.map((item, index) => {
                // let result = (
                //   Math.pow(2, item.size - 1) * ogiBNBBuy
                // ).toString();
                const marketValue = buyValues[item.id];
                console.log(
                  marketValue?.ogiBUSDBuyVal.slice(0, 10),
                  "marketValue?.ogiBUSDBuyVal"
                );

                // console.log("result", result);
                return (
                  <div
                    className="rounded-[10px] bg-cover mb-6"
                    key={item.value}
                    id={item.value}
                    style={{
                      backgroundImage: `url(${
                        imagesForLevelBg[`level${item.size}`]
                      })`,
                    }}
                  >
                    <div className="grid grid-cols-3">
                      <img
                        src={imagesForLevel[`level${item.size}`]}
                        alt="imageBG"
                        className={` my-4 ml-[-12px]`}
                      />

                      <div className="mt-6 md:mt-6 lg:mt-4 xl:mt-8  ml-[-12px]">
                        <p className="font-medium text-[25px] md:text-[18px] lg:text-[20px] xl:text-[25px] xl:ml-[-20px]">
                          Level {item.size}
                        </p>
                        {/* <p>{item.id}</p> */}
                        {!BuyValue ? (
                          <p className=" text-gray-400 text-[12px]">
                            = $ N/A | =<span>$OGI N/A</span>
                          </p>
                        ) :  !marketValue?.ogiBNBBuyVal ?(
                          <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[12px] xl:ml-[-20px]">
                            = $
                            {/* {result.includes(".")
                              ? result.substring(0, 8)
                              : result} */}
                            <GridLoader size={5} color="purple"/> | =
                            <span>
                              $OGI{" "}
                              {/* {ogiBUSDBuy.includes(".")
                                ? ogiBUSDBuy.substring(0, 10)
                                : ogiBUSDBuy} */}
                              <GridLoader size={5} color="purple"/>
                            </span>
                          </p>
                        ):(
                          <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[12px] xl:ml-[-20px]">
                          = $
                          {/* {result.includes(".")
                            ? result.substring(0, 8)
                            : result} */}
                          {marketValue?.ogiBNBBuyVal.slice(0, 10)}| =
                          <span>
                            $OGI{" "}
                            {/* {ogiBUSDBuy.includes(".")
                              ? ogiBUSDBuy.substring(0, 10)
                              : ogiBUSDBuy} */}
                            {marketValue?.ogiBUSDBuyVal.slice(0, 10)}
                          </span>
                        </p>
                        )}
                      </div>

                      <BuyGems id={item.id} updateMyUi={""} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LiquidityPool;
