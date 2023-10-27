import React, { useEffect, useState } from "react";
import { CardsData, contentData, contentTran } from "./data";
import { AiOutlineInfoCircle, AiOutlineBell } from "react-icons/ai";
import { Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Web3 from "web3";
import config from "../../config.json";
import Swiper from "swiper";
import Swipper from "./Swipper";
import DashboardMobileCards from "../DashboardMobileCards";

// import { ActiveStatus } from "../Sidebar/Sidebar";

function Dashboard() {
  const [NFTHold, setNFTHold] = useState("");
  const [OGIHold, setOGIHold] = useState("");
  const [tvlGem, setTvlGem] = useState("");
  const [ogiBUSD, setOgiBUSD] = useState("");
  const [ethBUSD, setEthBUSD] = useState("");
  const [gemBUSD, setGemBUSD] = useState("");

  const wallet = useSelector((state) => state?.rootReducer?.wallet?.wallet);
  const ogi = useSelector((state) => state?.rootReducer?.wallet?.ogi);
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address?.address
  );
  const Gems = useSelector((state) => state.rootReducer.wallet.gems);
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
  // console.log("GEMTokens", GEMTokens);

  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );

  // const GemsVal=Gems.gems.toString();
  console.log("Wallet is", wallet);
  console.log("OGI is", ogi);
  console.log("Gems",Gems.gems);
  // console.log("Address", stateAddress);
  // console.log("Gems", GemsVal);

  const handleOGIBUSD = async () => {
    const GemWalletHold = await NFTContract.methods.count().call();
    setNFTHold(GemWalletHold);
    const OgiWalletHold = await OGITokens.methods.count().call();
    setOGIHold(OgiWalletHold);

    const tvlGems = await NFTContract.methods.getTVL().call();
    const tvlEth = web3.utils.fromWei(tvlGems, "ether");
    console.log("tvlGems", tvlGems);
    let whole = 10000;
let percentage = (tvlEth / whole) * 100;
console.log('percentage',percentage);
setTvlGem(percentage);
    // if (tvlEth.toString().includes(".")) {
    //   setTvlGem(tvlEth.toString().slice(0, 5));
    // } else {
    //   console.log(tvlEth.toString() + "..");
    //   setTvlGem(tvlEth.slice(0, 4));
    // }

    console.log("OGI IN BUSD", ogi.ogi);
    // console.log('Val',web3.utils.fromWei(ogi.ogi.toString(), "wei"));
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
    setEthBUSD(BUSEDeth);
  };

  useEffect(() => {
    handleOGIBUSD();
  }, [ogiBUSD]);
  useEffect(() => {
    handleOGIBUSD();
    handleGemBUSD();
    handleEthBUSD();
  }, [stateAddress]);

  return (
    <div className=" bg-[#141627]  md:h-[calc(100vh-90px)] lg:h-[calc(100vh-90px)] overflow-auto">
      {/* ----------HEADER------------ */}

      {/* -----CARDS----- */}

      <DashboardMobileCards/>
      {/* -----CONTENTS----- */}
            <div className="block md:hidden">
              <Swipper />
            </div>
            <div className="hidden md:block">
      <div className="max-w-[120vw]">
        <div className="grid grid-cols-1 px-4 py-6 md:px-8 lg:px-8  xl:px-16">
          <div className="row-span-1 rounded-[10px] bg-contentImg  bg-cover ">
              <div className="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-3 lg:grid-cols-5 text-white bg-[#41445F36]  rounded-[10px] ">
                {contentData.map((item) => {
                  return (
                    <div key={item.id}>
                      <div className="ml-[20px] text-center md:text-start lg:text-start">
                        {item.id === 5 ? (
                          <div className="py-10 px-4">
                            <div className=" ">
                              {!sign.sign ? (
                                <p className=" font-semibold text-[45px] flex">
                                  N/A
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-[15px] mt-[25px]">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : (
                                <p className="flex justify-center md:justify-start lg:justify-start font-semibold text-[45px] lg:text-[40px] xl:text-[45px]  ">
                                  {item.quantity}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-[15px] mt-[25px]">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              )}
                              <p className="font-normal mt-2 ">
                                {item.description}
                              </p>
                              <p className="text-[14px]  text-gray-400 ">
                                {item.sub_desc}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="py-10 ">
                            <div className=" border-[#6066b436] px-6  border-r-2">
                              {item.id == 1 && stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-start font-semibold text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {NFTHold}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : item.id == 2 && stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-start font-semibold text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {OGIHold}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : item.id == 3 && stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-start font-semibold text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {tvlGem}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-startfont-semibold text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {item.quantity}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className=" mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : (
                                <p className="flex font-semibold text-[45px]">
                                  N/A
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              )}
                              {/* <p className="flex font-semibold text-[45px]">
                              {item.quantity}
                              <Tooltip title={item.content} color="#F9B233">
                                <span className="ml-3 mt-[25px] ">
                                  <AiOutlineInfoCircle
                                    size={30}
                                    color={"#9da1de70"}
                                    className="cursor-pointer hover:!text-[#F9B233] "
                                  />
                                </span>
                              </Tooltip>
                            </p> */}
                              <p className="font-normal mt-2">
                                {item.description}
                              </p>
                              <p className="text-[14px] text-gray-400 ">
                                {item.sub_desc}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
      {/* -----------------Last div----------------- */}
      {/* <div className="grid grid-cols-1  py-6 px-20">
        <div className=" row-span-1 rounded-[10px]   text-white bg-[#41445F36] mt-[50px] mb-[50px] ">
          
          <div className="m-10">
            <h1 className="text-[22px]">TRANSACTION HISTORY</h1>
          </div>

          {contentTran.map((item) => {
            return (
              <div key={item.id}>
                {item.id === 4 ? (
                  <>
                    <div className="flex justify-between mt-2 mb-10 ml-10 mr-10">
                      <div className=" ">
                        <p>{item.description} </p>
                      </div>
                      <div className=" ">
                        <p>{item.time}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b-2 border-[#6066b436] mt-4 ml-10 mr-10">
                      <div className=" mb-5">
                        <p>{item.description} </p>
                      </div>
                      <div className=" ">
                        <p>{item.time}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div> */}
      {/* </div> */}
    </div>
  );
}

export default Dashboard;
