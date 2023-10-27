import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UnStakeGemsData } from "./data";
import bg1 from "../../assets/images/bg1.png";
import Gem1 from "../../assets/images/Gem1.png";
import Gem2 from "../../assets/images/Gemlvl6.png";
import Gem4 from "../../assets/images/Gemlvl4.png";
import Gem16 from "../../assets/images/Gemlvl16.png";
import bg2 from "../../assets/images/bglvl06.png";
import bg4 from "../../assets/images/bglvl4.png";
import bg16 from "../../assets/images/bglvl16.png";

import { Tooltip } from "antd";
import config from "../../config.json";
import Web3 from "web3";
import { ClipLoader, GridLoader, HashLoader } from "react-spinners";
import {
  setLoadingForAgainFetch,
  storeGEM,
  storeMyWalletGems,
  storeOGI,
  storeUnStake,
  storeWallet,
} from "../reduxtoolkit/smartContract";
import { CustomNotification } from "../../utils/Notification";

function UnStake(props) {
  const [isChecked, setIsChecked] = useState([]);
  const [tokenId, setTokenId] = useState("");
  const [tokenIdInfo, setTokenIdInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [sellValues, setSellValues] = useState([]);

  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const startTime = useSelector(
    (state) => state.rootReducer.wallet.startTime.startTime
  );
  // const endTimes = useSelector(
  //   (state) => state.rootReducer.wallet
  // );

  // console.log('endTIme',endTimes);

  const SellValue = useSelector(
    (state) => state?.rootReducer?.wallet?.sellValue.sellValue
  );
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  // const ogiBUSD = useSelector(
  //   (state) => state?.rootReducer?.wallet?.BUSD?.ogiBUSD
  // );

  const ogiBNBSell = useSelector(
    (state) => state?.rootReducer?.wallet?.BNBSell?.ogiBNBSell
  );
  console.log("BNBSell", ogiBNBSell);

  const ogiBUSDSell = useSelector(
    (state) => state?.rootReducer?.wallet?.BUSDSell?.ogiBUSDSell
  );
  console.log("BUSDSell", ogiBUSDSell);
  console.log("StartTime", startTime);
  const { ethereum } = window;
  const web3 = new Web3(ethereum);

  const StakeGems = new web3.eth.Contract(
    config.StakingABI,
    config.StakingGEMToken
  );
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const dispatch = useDispatch();

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

  const address = useSelector(
    (state) => state?.rootReducer?.wallet?.address.address
  );
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);

  const LSSVMRouterTokens = new web3.eth.Contract(
    config.LSSVMRouterABI,
    config.LSSVMRouterToken
  );
  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );

  const handleUpdate = async () => {
    let balanceInEther;
    const balanceInWei = await web3.eth.getBalance(address);
    console.log("Balance in Wei", balanceInWei);
    balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
    console.log("Balance in Ether", balanceInEther);
    const OGIS = await OGITokens.methods.balanceOf(address).call();
    const OGI = web3.utils.fromWei(OGIS, "ether");
    console.log("OGIS", OGI);
    const Gems = await NFTContract.methods.walletOfOwner(address).call();
    console.log("Gems", Gems.length);
    dispatch(storeWallet({ wallet: balanceInEther }));
    dispatch(storeOGI({ ogi: OGI }));
    dispatch(storeGEM({ gems: Gems.length }));
  };

  //   const myGemsWallet = useSelector(
  //     (state) => state?.rootReducer?.wallet?.myGemsWallet?.myGemsWallet
  //   );
  // console.log('My gems Wallet',myGemsWallet);

  var date = new Date();
  var deadline = Math.floor(date.getTime() / 1000) + 300;
  const MyGemsGet = async () => {
    let a;
    try {
      const StakeUserInfo = await StakeGems.methods
        .userInfo(stateAddress.address)
        .call();
      if (StakeUserInfo.startTime == 0) {
        setTokenId([]);
        setTokenIdInfo([]);
        setLoading(false);
      } else {
        let arr = [StakeUserInfo.tokenId];
        const sizeToLevel = (size) => {
          return Math.log2(size) + 1;
        };
        console.log("arr", arr);
        let a = await Promise.all(
          await arr?.map(async (val) => {
            let abc = await NFTContract.methods
              .tokenIdInfo(val)
              .call()
              .then((x) => {
                const value = {
                  ...x,
                  valueMulBy10: parseFloat(x.size) * 10,
                  level: sizeToLevel(x.size),
                };
                return value;
              });
            // console.log(abc, "abc");
            // setAllData(prev => ([...prev, {...abc, gem_id: val}]))
            return { ...abc, id: val };
          })
        );
        console.log(a, "MyGemsGet");
        dispatch(
          storeMyWalletGems({
            myGemsWallet: a,
          })
        );
        setTokenIdInfo(a);
      }
    } catch (error) {
      console.log("Error Message :", error);
    }
  };

  const BNBSell = async (id) => {
    try {
      const NFTLevel = await LSSVMRouterTokens.methods
        .getPairByTokenId(config.NFTToken, id)
        .call();
      console.log("NFTLevel Address", NFTLevel);

      const getSellValue = await LSSVMRouterTokens.methods
        .getSellPairCost([[NFTLevel, ["1"]]])
        .call();
      console.log("GetSellValue", getSellValue);
      // let result = (Math.pow(2, size - 1) * getSellValue).toString();
      // const val = web3.utils.toWei(getSellValue, "ether");
      // console.log("result", result);

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

  const handleUserInfo = async () => {
    const StakeUserInfo = await StakeGems.methods
      .userInfo(stateAddress.address)
      .call();
    setEndTime(StakeUserInfo.endTime);
    console.log("Stake User Info", StakeUserInfo);
    if (StakeUserInfo.startTime == 0) {
      setTokenId([]);
      setLoading(false);
    } else {
      const sizeToLevel = (size) => {
        return Math.log2(size) + 1;
      };
      setTokenId(StakeUserInfo.tokenId);
      // console.log('StakeUserinfo',StakeUserInfo.tokenId);
      let arr = [StakeUserInfo.tokenId];
      console.log("arr", arr);
      let a = await Promise.all(
        await arr?.map(async (val) => {
          let abc = await NFTContract.methods
            .tokenIdInfo(val)
            .call()
            .then((x) => {
              const value = {
                ...x,
                valueMulBy10: parseFloat(x.size) * 10,
                level: sizeToLevel(x.size),
              };
              return value;
            });
          // console.log(abc, "abc");
          // setAllData(prev => ([...prev, {...abc, gem_id: val}]))
          return { ...abc, id: val };
        })
      );
      console.log(a, "MyGemsGet");
      setTokenIdInfo(a);
      // MyGemsGet();
      setLoading(false);
    }
  };
  // console.log("HandleUserInfo", StakeUserInfo.tokenId);
  // dispatch(storeStartTime({ startTime: StakeUserInfo.startTime }));

  const handleClick = async () => {
    try {
      if (deadline > endTime) {
        setLoading(true);
        await StakeGems.methods.unStakeGem().send({
          from: stateAddress.address,
        });

        await MyGemsGet();
        await handleUpdate();
        setLoading(false);
        localStorage.removeItem("isRunning");
        dispatch(setLoadingForAgainFetch());
      } else {
        CustomNotification(
          "error",
          "You cannot unStake Nfts before 12 hrs after you stake it."
        );
      }
    } catch (error) {
      console.log("Error Message", error);
      setLoading(false);
    }
  };

  const handleNotify = () => {
    if (deadline < endTime) {
      CustomNotification(
        "error",
        "You cannot unStake Nfts before 12 hrs after you stake it."
      );
    }
  };

  console.log("Token Id info", tokenIdInfo);

  useEffect(() => {
    setLoading(true);
    handleUserInfo();
  }, [stateAddress.address, startTime]);

  useEffect(() => {
    async function fetchSellValues() {
      const newSellValues = {};
      for (const item of tokenIdInfo) {
        const result = await BNBSell(item.id);
        newSellValues[item.id] = {
          ogiBNBSellVal: result.OGItoBNBEth,
          ogiBUSDSellVal: result.BNBtoBUSDEth,
        };
      }
      setSellValues(newSellValues);
    }
    fetchSellValues();
  }, [tokenIdInfo]);
  return (
    <>
      <div className="relative md:top-0 lg:top-[-40px]  lg:ml-[50%]  xl:ml-[55%] md:ml-0">
        {stateAddress.address &&
        sign.sign &&
        tokenId.length != 0 &&
        deadline > endTime ? (
          <button
            className="rounded-[10px] text-white  text-center py-2 px-6 font-semibold
                        bg-gradient-to-r  from-light-violet to-regal-blue"
            onClick={() => handleClick()}
          >
            {loading ? (
              <>
                <ClipLoader size={12} className="mt-1" color="white" /> Unstake
              </>
            ) : (
              <span className="flex">Unstake</span>
            )}
          </button>
        ) : sign.sign && tokenId.length == 0 ? (
          <Tooltip title="Please first Stake NFT">
            <button
              className="rounded-[10px] text-white  text-center py-2 px-6 font-semibold
                bg-gradient-to-r  from-light-violet to-regal-blue opacity-60"
              //   onClick={() => handleClick()}
            >
              UnStake
            </button>
          </Tooltip>
        ) : deadline < endTime ? (
          <Tooltip title="Cannot Unstake before 12 Hr after you stake it">
            <button
              className="rounded-[10px] text-white  text-center py-2 px-6 font-semibold
                bg-gradient-to-r  from-light-violet to-regal-blue opacity-60"
              onClick={() => handleNotify()}
            >
              UnStake
            </button>
          </Tooltip>
        ) : (
          <Tooltip title="Please connect to wallet first">
            <button
              className="rounded-[10px] text-white  text-center py-2 px-6 font-semibold
              bg-gradient-to-r  from-light-violet to-regal-blue opacity-60"
              //   onClick={() => handleClick()}
            >
              UnStake
            </button>
          </Tooltip>
        )}
      </div>

      <div className="mb-[100px]">
        {!stateAddress.address ? (
          <>
            <div className="text-[18px] font-semibold text-white">
              No NFTs to show..
            </div>
          </>
        ) : (
          <>
            {loading == true ? (
              <div className="flex justify-center mt-6">
                <HashLoader color="purple" size={100} />
              </div>
            ) : tokenIdInfo.length == 0 ? (
              <div className="text-[18px] font-semibold text-white">
                No NFTs to show..
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-6 gap-10 pr-14 text-white mb-[100px]">
                {tokenIdInfo.map((item) => {
                  const sellValue = sellValues[item.id];
                  return (
                    <div>
                      <div
                        className="rounded-[10px] bg-cover"
                        style={{
                          backgroundImage:
                            item.level && imagesForLevelBg[`level${item.size}`]
                              ? `url(${imagesForLevelBg[`level${item.size}`]})`
                              : `url(${bg1})`,
                        }}
                        key={item.id}
                      >
                        <div className="grid grid-cols-2">
                          <div>
                            {item.level &&
                            imagesForLevel[`level${item.size}`] ? (
                              <img
                                src={imagesForLevel[`level${item.size}`]}
                                alt="imageBG"
                                className={`mt-4 mb-3`}
                              />
                            ) : (
                              <img
                                src={Gem1}
                                alt="imageBG"
                                className={`mt-4 mb-3`}
                              />
                            )}
                          </div>
                          <div className="mt-4 md:mt-12 lg:mt-8 xl:mt-5 md:ml-[-12px] lg:ml-[-12px] xl:ml-[-70px] ">
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
                                <GridLoader size={5} color="purple"/> | =
                                <span>
                                  $OGI <GridLoader size={5} color="purple"/>
                                </span>
                              </p>
                            ) : (
                              <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                = ${sellValue?.ogiBNBSellVal.slice(0, 10)}| =
                                <span>
                                  $OGI {sellValue?.ogiBUSDSellVal.slice(0, 10)}
                                </span>
                              </p>
                            )}
                            {/* <p className=" text-gray-400 text-[13px]">
                              {item.amount}
                              <span>{item.value}</span>
                            </p> */}

                            {/* <p>{item.id}</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default UnStake;
