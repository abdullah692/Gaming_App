import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import Web3 from "web3";
import config from "../../config.json";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "antd";
import {
  storeEndTime,
  storeGEM,
  storeMyWalletGems,
  storeOGI,
  storeStakingReward,
  storeStartTime,
  storeWallet,
} from "../reduxtoolkit/smartContract";
import Gem1 from "../../assets/images/Gem1.png";
import bg1 from "../../assets/images/bg1.png";
import UnStake from "./UnStake";
import Gem2 from "../../assets/images/Gemlvl6.png";
import Gem4 from "../../assets/images/Gemlvl4.png";
import Gem16 from "../../assets/images/Gemlvl16.png";
import bg2 from "../../assets/images/bglvl06.png";
import bg4 from "../../assets/images/bglvl4.png";
import bg16 from "../../assets/images/bglvl16.png";
import { ClipLoader, GridLoader } from "react-spinners";

const onChange = (key) => {
  console.log(key);
};

const Stake = (StackGemsData) => {
  const [isChecked, setIsChecked] = useState([]);
  const [myGemId, setMyGemId] = useState("");
  const [stakedNft, setStakedNft] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [sellValues, setSellValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  // const [stakingReward,setStakingReward]=useState('');
  const dispatch = useDispatch();
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const loadingForAgainFetch = useSelector(
    (state) => state?.rootReducer?.wallet?.loadingForAgainFetch
  );

  const myGemsWallet = useSelector(
    (state) => state?.rootReducer?.wallet?.myGemsWallet?.myGemsWallet
  );

  console.log("myGemsWallet", myGemsWallet);
  const SellValue = useSelector(
    (state) => state?.rootReducer?.wallet?.sellValue.sellValue
  );

  const ogiBNBSell = useSelector(
    (state) => state?.rootReducer?.wallet?.BNBSell?.ogiBNBSell
  );
  console.log("BNBSell", ogiBNBSell);

  const ogiBUSDSell = useSelector(
    (state) => state?.rootReducer?.wallet?.BUSDSell?.ogiBUSDSell
  );
  console.log("BUSDSell", ogiBUSDSell);

  // const ogiBUSD = useSelector(
  //   (state) => state?.rootReducer?.wallet?.BUSD?.ogiBUSD
  // );
  // console.log("ogiBUSD", ogiBUSD);

  console.log("adsdas", myGemsWallet);
  const { ethereum } = window;
  const web3 = new Web3(ethereum);

  const StakeGems = new web3.eth.Contract(
    config.StakingABI,
    config.StakingGEMToken
  );
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);

  const imagesForLevel = {
    level1: Gem1,
    level2: Gem2,
    level3: Gem4,
    level5: Gem16,
  };

  const imagesForLevelBg = {
    level1: bg1,
    level2: bg2,
    level3: bg4,
    level5: bg16,
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

  const handleChecked = (event, val) => {
    const { checked, id, value } = event.target;
    console.log(`The id is ${id} is checked ${checked} and value is ${val}`);
    setIsChecked(id);
    setMyGemId(val);
  };

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

  const MyGemsGet = async () => {
    let a;
    try {
      const sizeToLevel = (size) => {
        return Math.log2(size) + 1;
      };
      const myGems = await NFTContract.methods
        .walletOfOwner(stateAddress.address)
        .call();
      console.log(myGems, "myGemsDataStake");

      a = await Promise.all(
        await myGems?.map(async (val) => {
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
    } catch (error) {
      console.log("Error Message :", error);
    }
  };



  const handleUserInfo = async () => {
    const StakeUserInfo = await StakeGems.methods
      .userInfo(stateAddress.address)
      .call();
    console.log("HandleUserInfo", StakeUserInfo);
    dispatch(storeStartTime({ startTime: StakeUserInfo.startTime }));
    setStartTime(StakeUserInfo.startTime);
    if (StakeUserInfo.startTime == 0) {
      setActive(false);
    }
  };

  const handleClick = async () => {
    console.log("Id is", myGemId);
    try {
      setLoading(true);
      await NFTContract.methods
        .setApprovalForAll(config.StakingGEMToken, true)
        .send({
          from: stateAddress.address,
        });
      await StakeGems.methods.StakeGem(myGemId).send({
        from: stateAddress.address,
      });

      const StakeUserInfo = await StakeGems.methods
        .userInfo(stateAddress.address)
        .call();

      console.log("HandleUserInfo", StakeUserInfo);
      dispatch(storeEndTime({ endTime: StakeUserInfo.endTime }));
      setStartTime(StakeUserInfo.startTime);
      dispatch(storeStakingReward(true));
      localStorage.setItem("isRunning", true);
      await MyGemsGet();
      await handleUpdate();
      setLoading(false);
    } catch (error) {
      console.log("Error Message", error);
      setLoading(false);
    }
  };

  const BNBSell = async (id) => {
    try {
      const NFTLevel = await LSSVMRouterTokens.methods
        .getPairByTokenId(config.NFTToken, id)
        .call();
      console.log("NFTLevel Address Stake", NFTLevel);

      const getSellValue = await LSSVMRouterTokens.methods
        .getSellPairCost([[NFTLevel, ["1"]]])
        .call();
      console.log("GetSellValue Stake", getSellValue);
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

  // const handleVerify=()=>{
  //   console.log('Verify is clicked');
  //   dispatch(
  //     storeStakingReward(true)
  //   );
  //   localStorage.setItem("isRunning", true);
  // }

  // const handleClick = async () => {
  //   console.log("Id is", myGemId);
  //   try {
  //     await NFTContract.methods
  //       .setApprovalForAll(config.StakingGEMToken, true)
  //       .send({
  //         from: stateAddress.address,
  //       })

  //         // alert('Approved')
  //         // console.log('Approved');
  //         await StakeGems.methods.StakeGem(myGemId).send({
  //           from: stateAddress.address,
  //         });

  //         const StakeUserInfo = await StakeGems.methods
  //     .userInfo(stateAddress.address)
  //     .call();
  //   console.log("HandleUserInfo", StakeUserInfo.endTime);
  //     setStartTime(StakeUserInfo.startTime);
  //   dispatch(storeEndTime({ endTime: StakeUserInfo.endTime }));

  //      await MyGemsGet();
  //      await StakingReward();
  //   } catch (error) {
  //     console.log("Error Message", error);
  //   }
  // };

  useEffect(() => {
    handleUserInfo();
  }, [stateAddress.address, myGemsWallet, loadingForAgainFetch]);

  useEffect(() => {
    MyGemsGet();
  }, [active]);
  // useEffect(() => {
  //   async function fetchSellValues() {
  //     const newSellValues = {};
  //     for (const item of myGemsWallet) {
  //       const result = await BNBSell(item.id);
  //       newSellValues[item.id] = {
  //         ogiBNBSellVal: result.OGItoBNBEth,
  //         ogiBUSDSellVal: result.BNBtoBUSDEth,
  //       };
  //     }
  //     setSellValues(newSellValues);
  //   }
  //   fetchSellValues();
  // }, [myGemsWallet]);

  // useEffect(() => {
  //   async function fetchSellValues() {
  //     const promises = myGemsWallet.map(async (item) => {
  //       const result = await BNBSell(item.id);
  //       console.log('results first',result);
  //       return {
  //         id: item.id,
  //         ogiBNBSellVal: result.OGItoBNBEth,
  //         ogiBUSDSellVal: result.BNBtoBUSDEth,
  //       };
        
  //     });
      
  //     const newBuyValues = {};
      
  //     const results = await Promise.all(promises);
  //     for (const result of results) {
  //       newBuyValues[result.id] = {
  //         ogiBNBSellVal: result.ogiBNBSellVal,
  //         ogiBUSDSellVal: result.ogiBUSDSellVal,
  //       };
  //       console.log('newBuyValues',newBuyValues);
  //     }
  //     setSellValues(newBuyValues);
  //   }
    
  //   fetchSellValues();
  // }, [myGemsWallet]);

  
  
  useEffect(() => {
    async function fetchSellValues() {
      const promises = myGemsWallet.map(async (item) => {
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
  }, [myGemsWallet]);

  return (
    <>
      {/* <div>
     <button onClick={handleVerify}>Click Me</button> 
    </div> */}
      <div className="relative md:top-0 lg:top-[-40px]  lg:ml-[50%]  xl:ml-[56%] md:ml-0">
        {startTime == 0 && stateAddress.address && isChecked.length > 0 ? (
          <button
            className="rounded-[10px] text-white  text-center py-2 px-6 font-semibold
        bg-gradient-to-r  from-light-violet to-regal-blue"
            onClick={() => handleClick()}
          >
            {loading ? (
              <>
                <ClipLoader size={12} className="mt-1" color="white" />
                Stake
              </>
            ) : (
              <span className="flex">Stake</span>
            )}
          </button>
        ) : startTime != 0 ? (
          <Tooltip title="You have already staked">
            <button
              className="rounded-[10px]  text-white text-center py-2 px-6 font-semibold
        bg-gradient-to-r  from-light-violet to-regal-blue opacity-60 "
            >
              Stake
            </button>
          </Tooltip>
        ) : !stateAddress.address ? (
          <Tooltip title="Please connect to wallet first">
            <button
              className="rounded-[10px]  text-white text-center py-2 px-6 font-semibold
        bg-gradient-to-r  from-light-violet to-regal-blue opacity-60 "
            >
              Stake
            </button>
          </Tooltip>
        ) : (
          <Tooltip title="Please select a Gem to Stake">
            <button
              className="rounded-[10px]  text-white text-center py-2 px-6 font-semibold
        bg-gradient-to-r  from-light-violet to-regal-blue opacity-60 "
            >
              Stake
            </button>
          </Tooltip>
        )}
      </div>

      {/* <div className="text-white">
  <button onClick={handleVerify}>Check It</button>
</div> */}

      <div className="mb-[100px]">
        {!sign.sign ? (
          <>
            <div className="text-[18px] font-semibold text-white">
              No NFTs to show..
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  py-6  gap-10 pr-14 text-white mb-[100px]">
            {myGemsWallet.length == 0 ? (
              <>
                <div className="text-[18px] font-semibold text-white">
                  No NFTs to show..
                </div>
              </>
            ) : (
              myGemsWallet?.map((item) => {
                const sellValue = sellValues[item.id];
                return (
                  <>
                    {startTime == 0 ? (
                      <>
                        {isChecked.includes(item.id) ? (
                          <>
                            <div
                              className="rounded-[10px] bg-cover"
                              style={{
                                backgroundImage:
                                  item.level &&
                                  imagesForLevelBg[`level${item.size}`]
                                    ? `url(${
                                        imagesForLevelBg[`level${item.size}`]
                                      })`
                                    : `url(${bg1})`,
                              }}
                              key={item.id}
                            >
                              <div className="grid grid-cols-3">
                                <div className="mt-8 md:mt-8 lg:mt-8 xl:mt-12 ml-4">
                                  <input
                                    type="radio"
                                    id={item.id}
                                    name="fav_language"
                                    value={item.id}
                                    onChange={(event) =>
                                      handleChecked(event, item.id)
                                    }
                                    className="h-5 w-5 text-[#CC00FF] focus:ring-[#CC00FF] bg-transparent"
                                  />
                                </div>
                                <div>
                                  {item.level &&
                                  imagesForLevel[`level${item.size}`] ? (
                                    <img
                                      src={imagesForLevel[`level${item.size}`]}
                                      alt="imageBG"
                                      className={`mt-4 ml-[-30px] md:ml-[-30px] lg:ml-[-30px] xl:ml-[-80px] mb-3`}
                                    />
                                  ) : (
                                    <img
                                      src={Gem1}
                                      alt="imageBG"
                                      className={`mt-4 ml-[-30px] md:ml-[-30px] lg:ml-[-30px] xl:ml-[-80px] mb-3`}
                                    />
                                  )}
                                </div>
                                <div className="mt-4 ml-[-30px] md:mt-8 lg:mt-8 xl:mt-5 md:ml-[-12px] lg:ml-[-12px] xl:ml-[-70px] ">
                                  <p className="font-medium text-[25px] md:text-[18px] lg:text-[20px] xl:text-[25px]">
                                    Level {item.size}
                                  </p>
                                  {!SellValue ? (
                                    <p className=" text-gray-400 text-[12px]">
                                      = $ N/A | =<span>$OGI N/A</span>
                                    </p>
                                  ) : !sellValue?.ogiBNBSellVal ? (
                                    <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                    = $<GridLoader size={5} color="purple"/>
                                    | =
                                    <span>
                                      $OGI{" "}
                                      <GridLoader size={5} color="purple"/>
                                    </span>
                                  </p>
                                  ):(
                                    <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                      = ${sellValue?.ogiBNBSellVal.slice(0, 10)}
                                      | =
                                      <span>
                                        $OGI{" "}
                                        {sellValue?.ogiBNBSellVal.slice(0, 10)}
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
                          </>
                        ) : (
                          <>
                            <div
                              className="rounded-[10px] bg-cover opacity-60"
                              style={{
                                backgroundImage:
                                  item.level &&
                                  imagesForLevelBg[`level${item.size}`]
                                    ? `url(${
                                        imagesForLevelBg[`level${item.size}`]
                                      })`
                                    : `url(${bg1})`,
                              }}
                              key={item.id}
                            >
                              <div className="grid grid-cols-3">
                                <div className="mt-8 md:mt-8 lg:mt-8 xl:mt-12 ml-4">
                                  <input
                                    type="radio"
                                    id={item.id}
                                    name="fav_language"
                                    value={item.value}
                                    onChange={(event) =>
                                      handleChecked(event, item.id)
                                    }
                                    className="h-5 w-5 text-[#CC00FF] focus:ring-[#CC00FF] bg-transparent"
                                  />
                                </div>
                                <div>
                                  {item.level &&
                                  imagesForLevel[`level${item.size}`] ? (
                                    <img
                                      src={imagesForLevel[`level${item.size}`]}
                                      alt="imageBG"
                                      className={`mt-4 ml-[-30px] md:ml-[-30px] lg:ml-[-30px] xl:ml-[-80px] mb-3`}
                                    />
                                  ) : (
                                    <img
                                      src={Gem1}
                                      alt="imageBG"
                                      className={`mt-4 ml-[-30px] md:ml-[-30px] lg:ml-[-30px] xl:ml-[-80px] mb-3`}
                                    />
                                  )}
                                </div>
                                <div className="mt-4 ml-[-30px] md:mt-8 lg:mt-8 xl:mt-5 md:ml-[-12px] lg:ml-[-12px] xl:ml-[-70px] ">
                                  <p className="font-medium text-[25px] md:text-[18px] lg:text-[20px] xl:text-[25px]">
                                    Level {item.size}
                                  </p>
                                  {!SellValue ? (
                                    <p className=" text-gray-400 text-[12px]">
                                      = $ N/A | =<span>$OGI N/A</span>
                                    </p>
                                  ) :  !sellValue?.ogiBNBSellVal ? (
                                    <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                    = $<GridLoader size={5} color="purple"/>
                                    | =
                                    <span>
                                      $OGI{" "}
                                      <GridLoader size={5} color="purple"/>
                                    </span>
                                  </p>
                                  ):(
                                    <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                      = ${sellValue?.ogiBNBSellVal.slice(0, 10)}
                                      | =
                                      <span>
                                        $OGI{" "}
                                        {sellValue?.ogiBNBSellVal.slice(0, 10)}
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
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Tooltip title="You have already staked">
                          <div
                            className="rounded-[10px] bg-cover opacity-60"
                            style={{
                              backgroundImage:
                                item.level &&
                                imagesForLevelBg[`level${item.size}`]
                                  ? `url(${
                                      imagesForLevelBg[`level${item.size}`]
                                    })`
                                  : `url(${bg1})`,
                            }}
                            key={item.id}
                          >
                            <div className="grid grid-cols-3">
                              <div className="mt-8 md:mt-8 lg:mt-8 xl:mt-12 ml-4">
                                <input
                                  type="radio"
                                  id={item.id}
                                  name="fav_language"
                                  value={item.id}
                                  // onChange={(event) => handleChecked(event)}
                                  disabled
                                  className="h-5 w-5 text-[#CC00FF] focus:ring-[#CC00FF] bg-transparent"
                                />
                              </div>
                              <div>
                                {item.level &&
                                imagesForLevel[`level${item.size}`] ? (
                                  <img
                                    src={imagesForLevel[`level${item.size}`]}
                                    alt="imageBG"
                                    className={`mt-4 ml-[-30px] md:ml-[-30px] lg:ml-[-30px] xl:ml-[-80px] mb-3`}
                                  />
                                ) : (
                                  <img
                                    src={Gem1}
                                    alt="imageBG"
                                    className={`mt-4 ml-[-30px] md:ml-[-30px] lg:ml-[-30px] xl:ml-[-80px] mb-3`}
                                  />
                                )}
                              </div>
                              <div className="mt-4 ml-[-30px] md:mt-8 lg:mt-8 xl:mt-10 md:ml-[-12px] lg:ml-[-12px] xl:ml-[-70px] ">
                                <p className="font-medium text-[25px] md:text-[18px] lg:text-[20px] xl:text-[25px]">
                                  Level {item.size}
                                </p>
                                {!sellValue?.ogiBNBSellVal ? (
                                  <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                  = $
                                  <GridLoader size={5} color="purple"/>
                                  | =
                                  <span>
                                    $OGI{" "}
                                    <GridLoader size={5} color="purple"/>
                                  </span>
                                </p>
                                ):(

                                <p className=" text-gray-400 text-[12px] md:text-[10px] lg:text-[10px]">
                                  = ${sellValue?.ogiBNBSellVal.slice(0, 10)}| =
                                  <span>
                                    $OGI{" "}
                                    {sellValue?.ogiBUSDSellVal.slice(0, 10)}
                                  </span>
                                </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                      </>
                    )}
                  </>
                  //   )}
                  // </>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

// const UnStake=()=>{
// return(
//   <>
//   <div className="relative top-[-40px]  ml-[56%]">
// {
//   stateAddress.address ? (
//     <button
//     className="rounded-[10px] text-white  text-center py-2 px-6 font-semibold
// bg-gradient-to-r  from-light-violet to-regal-blue"
//     onClick={() => handleClick()}
//   >
//     Stake
//   </button>
//   ):(
//     <button
//     className="rounded-[10px] text-white  text-center py-2 px-6 font-semibold
// bg-gradient-to-r  from-light-violet to-regal-blue"
//     onClick={() => handleClick()}
//   >
//     Stake
//   </button>
//   )
// }
//   </div>
//   </>
// )
// }
const StackTab = ({ StackGemsData }) => {
  const startTime = useSelector(
    (state) => state?.rootReducer?.wallet?.startTime?.startTime
  );
  // console.log("StartTIme", startTime);
  return (
    <>
      <div className="relative">
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          tabBarStyle={{ color: "gray" }}
          items={[
            {
              label: `Stake`,
              key: "1",
              children: Stake(StackGemsData),
            },
            {
              label: `Unstake`,
              key: "2",
              children: <UnStake />,
              style: { color: "white" },
            },
          ]}
        />
      </div>
    </>
  );
};
export default StackTab;
