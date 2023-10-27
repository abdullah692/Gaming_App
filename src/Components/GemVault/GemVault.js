import React, { useState, useEffect } from "react";
import Generation from "./Generation";
import { RiArrowDownSLine } from "react-icons/ri";
import { GenNos, SagaNos, GemVaultGems } from "./data";
import Gem from "../../assets/images/lvlGem1.png";
import Saga from "../Saga/Saga";
import MintButton from "./MintButton";
import { useSelector } from "react-redux";
import Redeem from "./Redeem";
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
import { HashLoader, GridLoader } from "react-spinners";
import LiquidityAndVaultData from "../LiquidityAndVaultData";
import DashboardMobileCards from "../DashboardMobileCards";

function GemVault({ GemVaultData }) {
  const [selectAll, setSelectAll] = useState(false);
  const [IsChecked, setIsChecked] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myGems, setMyGems] = useState([]);
  const [ogiPrice, setOgiPrice] = useState("");
  const [sellValues, setSellValues] = useState([]);

  const wallet = useSelector((state) => state?.rootReducer?.wallet?.wallet);
  const OGI = useSelector((state) => state.rootReducer.wallet.ogi);
  const Gems = useSelector((state) => state.rootReducer.wallet.gems);
  const address = useSelector(
    (state) => state?.rootReducer?.wallet?.address?.address
  );
  const saga = useSelector((state) => state?.rootReducer?.saga);
  const msg = useSelector((state) => state?.rootReducer?.wallet?.msg.msg);
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const SellValue = useSelector(
    (state) => state?.rootReducer?.wallet?.sellValue.sellValue
  );

  const ogiBUSD = useSelector(
    (state) => state?.rootReducer?.wallet?.BUSD?.ogiBUSD
  );
  const myGemsWallet = useSelector(
    (state) => state?.rootReducer?.wallet?.myGemsWallet?.myGemsWallet
  );
  console.log("My gdadsds", myGemsWallet);
  // console.log(myGems, "gemsDataaaattaaaaaa");
  console.log(saga, "Saga Val");
  // console.log('Msg',msg);

  const ogiBNBSell=useSelector(
    (state) => state?.rootReducer?.wallet?.BNBSell?.ogiBNBSell
  );
  console.log('BNBSell',ogiBNBSell);

  
  const ogiBUSDSell=useSelector(
    (state) => state?.rootReducer?.wallet?.BUSDSell?.ogiBUSDSell
  );
  console.log('BUSDSell',ogiBUSDSell);
  const loadingForAgainFetch = useSelector((state) => state?.rootReducer?.wallet?.loadingForAgainFetch);

  const { ethereum } = window;
  const web3 = new Web3(ethereum);

  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);

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

  const LSSVMRouterTokens = new web3.eth.Contract(
    config.LSSVMRouterABI,
    config.LSSVMRouterToken
  );

  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );

  // const MyGemsGet = async () => {
  //   try {
  //     const myGemsData = await NFTContract.methods
  //       .walletOfOwner(address)
  //       .call();
  //     // setGemData(myGemsData)
  //     console.log(myGemsData, "myGemsData");

  //     a = await Promise.all(
  //       await myGemsData?.map(async (val) => {
  //         let abc = await NFTContract.methods
  //           .tokenIdInfo(val)
  //           .call()
  //           .then((x) => {
  //             return x;
  //           });
  //         // console.log(abc, "abc");
  //         // setAllData(prev => ([...prev, {...abc, gem_id: val}]))
  //         return { ...abc, id: val };
  //       })
  //     );
  //     console.log(a, "MyGemsGet");
  //     setAllData(a);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error Message :", error);
  //   }
  // };

  const BNBSell = async (id) => {
    try {
      const NFTLevel=await LSSVMRouterTokens.methods
      .getPairByTokenId(config.NFTToken,id).call();
      console.log('NFTLevel Address',NFTLevel);

      const getSellValue = await LSSVMRouterTokens.methods
        .getSellPairCost([[NFTLevel, ["1"]]])
        .call();
      console.log("GetSellValue", getSellValue);
      // let result = (
      //   Math.pow(2, size-1) * getSellValue
      // ).toString();
      // const val = web3.utils.toWei(getSellValue, "ether");
      // console.log('result',result);

      const BNBToken = config.BNBToken;
      const OGIToken = config.OGIToken;
      const OGItoBNB = await PancakeRouter.methods
        .getAmountsOut(getSellValue,[BNBToken, config.BUSDToken])
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
      ]).call();
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
        BNBtoBUSDEth
      };
      // setOgiBUSD(BNBtoBUSDEth);
    } catch (error) {
      console.log("Error Message", error);
    }
  };


  function filteredSaga() {
    console.log("filtered Saga");
    console.log("MY gemsWallet Gem Vault", myGemsWallet);
    const value = myGemsWallet?.filter((val) => {
      return val.generation == saga.sagaGemVault;
    });
    setMyGems(value);
    console.log("The final value Saga", value);
  }
  const handleOgiPrice = async () => {
    const ogiPrice = await NFTContract.methods.calculatePrice(1).call();
    const ogiEth = web3.utils.fromWei(ogiPrice, "ether");
    setOgiPrice(ogiEth);
    setLoading(false);
    console.log("OGI Price", ogiPrice);
  };

  const handleChecked = (event) => {
    //   const CheckedId=event.target.id;
    //  console.log('Id',CheckedId)
    const { checked, value, id } = event.target;
    console.log(
      `The value is ${value} which is Checked is ${checked} and haved id ${id}`
    );
    if (checked) {
      setIsChecked([id, ...IsChecked]);
    } else {
      setIsChecked(IsChecked.filter((e) => e != id));
    }
  };
  // console.log("Checked", IsChecked);

  const handleSelect = (event) => {
    const { name } = event.target;
    console.log("Name", name);
    setSelectAll(!selectAll);
    setIsChecked(myGems.map((li) => li.id));
    console.log("Select", selectAll);
    if (selectAll) {
      setIsChecked([]);
    }
  };

  useEffect(() => {
    handleOgiPrice();
    setLoading(true);
    
    if (myGemsWallet?.length > 0) {
      setLoading(false);
    }
  }, [address, myGemsWallet, msg]);

  useEffect(() => {
    filteredSaga();
  }, [saga.sagaGemVault, myGemsWallet,loadingForAgainFetch]);

  useEffect(() => {
    async function fetchSellValues() {
      const newSellValues = {};
      for (const item of myGems) {
        const result = await BNBSell(item.id);
        newSellValues[item.id] = {
          ogiBNBSellVal: result.OGItoBNBEth,
          ogiBUSDSellVal: result.BNBtoBUSDEth,
        };
      }
      setSellValues(newSellValues);
    }
    fetchSellValues();
  }, [myGems]);

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
      <div className="max-w-[130vw]">
        <div className="grid grid-cols-3 gap-4 py-6 px-16 ">
          <div class="col-span-2">
            <div className="grid grid-cols-1 ">
              <p className="text-[20px]">$OGI Price:</p>
              {!sign.sign ? (
                <p className="font-bold text-[40px]">N/A</p>
              ) : loading == true ? (
                <p className="font-bold text-[40px] m-4 mt-10">
                  <GridLoader color="purple" />
                </p>
              ) : (
                <p className="font-bold text-[40px]">{ogiPrice}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end ">
            <p className="text-[32px]">Generation</p>
            <div className="m-3">
              <p className="flex border-2 border-white px-2 py-1 rounded-[8px]">
                <Generation GenNos={GenNos} />
                <span className="mt-[3px]  ">
                  <RiArrowDownSLine />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex  md:flex md:justify-center lg:flex lg:justify-center xl:flex xl:justify-center">
        <img src={Gem} alt="gems" className="mt-[-50px] ml-[-50px] md:ml-0 lg:ml-0 xl:ml-0" />

        <div className="mt-[70px] ml-[-50px] md:ml-[-30px] lg:ml-[-30px] xl:ml-[-30px]">
          <p className="text-[30px] font-sans font-semibold">Level 01</p>
          <MintButton />
        </div>
      </div>

      <div className="grid grid-cols-1 py-6 px-14 mt-[-30px]">
        <div className="flex justify-between border-b-2 border-gray-500 ">
          <div className=" font-medium text-[25px]">My Gems</div>
          <div className="flex">
            {/* <button
              className="pr-10 pb-3 text-[#6658FF] font-semibold"
              onClick={handleSelect}
              name="selectAll"
            >
              {IsChecked.length > 0 && IsChecked.length >= 6
                ? "UnSelectAll"
                : "SelectAll"}
            </button> */}
            <p className="flex border-2 border-white px-4 rounded-[5px] mb-[10px]">
              <Saga Saga={SagaNos} val="sagaGemVault" />
              <span className="mt-[3px] ml-2">
                <RiArrowDownSLine />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div>
        {!sign.sign ? (
          <>
            <div className="text-[18px] font-medium  mb-[50px] py-6   px-16 ">
              Please Connect to wallet first..!!
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-6   px-16 lg:gap-5  md:gap-10 xl:gap-10 ">
            {myGems?.length == 0 ? (
              <>
                <div className="text-[20px] font-semibold mb-[150px]">
                  No NFTs to show ..
                </div>
              </>
            ) : loading == true ? (
              <div className="col-span-3 mb-[150px] mt-6 flex justify-center">
                <HashLoader color="#560871" size={90} />
              </div>
            ) : (
              myGems?.map((item) => {
                const sellValue = sellValues[item.id];
                // const OGIBNBSell=sellValue?.ogiBNBSellVal.toString();
                // console.log('OGIBNBSel',OGIBNBSell);
                // const OGIBUSDSell=sellValue?.ogiBUSDSellVal.toString();
                return (
                  <div>
                    <div
                      className="rounded-[10px] bg-cover mb-6  "
                       style={{
                              backgroundImage: item.level && imagesForLevelBg[`level${item.size}`]
                              ? `url(${imagesForLevelBg[`level${item.size}`]})`
                              : `url(${bg1})`,
                            }}
                      id={item.value}
                    >
                      <div className="grid grid-cols-3">
                      {item.level &&
                              imagesForLevel[`level${item.size}`] ? (
                                <img
                                  src={imagesForLevel[`level${item.size}`]}
                                  alt="imageBG"
                                  className={`my-4 md:ml-[-15px]  xl:ml-0 mt-6`}
                                />
                              ) : (
                                <img
                                  src={Gem1}
                                  alt="imageBG"
                                  className={`my-4 md:ml-[-15px]  xl:ml-0 mt-6`}
                                />
                              )}
                                  
                        <div className="mt-8 ml-[-12px]">
                          <p className="font-medium text-[25px] md:text-[18px] lg:text-[20px] xl:text-[25px]">
                            Level {item.size}
                          </p>
                          {!SellValue ? (
                            <p className=" text-gray-400 text-[12px]">
                              = $ N/A | =<span>$OGI N/A</span>
                            </p>
                          ) : !sellValue?.ogiBNBSellVal ? (
                            <p className=" text-gray-400 text-[14px] md:text-[10px] lg:text-[10px]">
                            = $
                            <GridLoader size={5} color="purple"/>
                          | =
                          <span>
                            $OGI{" "}
                            <GridLoader size={5} color="purple"/>
                          </span>
                          </p>
                          ):(
                            <p className=" text-gray-400 text-[14px] md:text-[10px] lg:text-[10px]">
                              = $
                              {sellValue?.ogiBNBSellVal.slice(0,10)}
                            | =
                            <span>
                              $OGI{" "}
                              {sellValue?.ogiBUSDSellVal.slice(0,10)}
                            </span>
                            </p>
                          )}
                          {/* <p className=" text-gray-400 text-[12px]">
                            {item.id}
                          </p> */}
                        </div>
                        {/* <div className="py-12 px-10"> */}
                        <Redeem id={item.id} filteredSaga={filteredSaga} />
                        {/* </div> */}
                      </div>
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

export default GemVault;
