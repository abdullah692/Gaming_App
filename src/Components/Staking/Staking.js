import React, { useState, useEffect } from "react";
import gems from "../../assets/images/gems.png";
import StackTab from "./StakeTab";
import { StackGemsData } from "../../Components/Staking/data";
import { useSelector } from "react-redux";
import Web3 from "web3";
import config from "../../config.json";
import { GridLoader } from "react-spinners";
import { CustomNotification } from "../../utils/Notification";
import Matic from "../../assets/images/matic.png";

function Staking({ StakingData, StackGemRewarded }) {
  const startTime = useSelector(
    (state) => state?.rootReducer?.wallet?.startTime?.startTime
  );
  console.log("StartTime", startTime);
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const stakingRewardval = useSelector(
    (state) => state?.rootReducer?.wallet.stakingReward
  );
  console.log("Staking Reward Val", stakingRewardval);

  const [days, setDays] = useState("0");
  const [loading, setLoading] = useState(false);
  const [claimedReward, setClaimedReward] = useState("");
  const [totalOTClaimedReward, settotalOTClaimedReward] = useState("");
  const [stakingReward, setStakingReward] = useState("");
  const [active, setActive] = useState(false);
  const [isRunning, setIsRunning] = useState(
    localStorage.getItem("isRunning") === "true" ? true : false
  );
  const { ethereum } = window;
  const web3 = new Web3(ethereum);

  var date = new Date();
  var deadline = Math.floor(date.getTime() / 1000) + 300;
  const StakeGems = new web3.eth.Contract(
    config.StakingABI,
    config.StakingGEMToken
  );

  const handleClick = async () => {
    try {
      console.log("name");
      const StakeUserInfo = await StakeGems.methods
        .userInfo(stateAddress.address)
        .call();
      console.log("EndTime", StakeUserInfo.endTime);
      // debugger
      if (deadline > StakeUserInfo.endTime) {
        const claimedReward = await StakeGems.methods.claimReward().send({
          from: stateAddress.address,
        });
        setActive(true);
        console.log("Claimed Reward", claimedReward);
      } else {
        CustomNotification(
          "error",
          "You cannot unStake Nfts before 12 hrs after you stake it."
        ).catch((error) => {
          console.log("Error Message", error);
        });
      }
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  const StakingReward = async () => {
    try {
      const StakingReward = await StakeGems.methods
        .totalReward(stateAddress.address)
        .call();
      const val = web3.utils.fromWei(StakingReward, "ether");
      setStakingReward(val);
      // dispatch(
      //   storeStakingReward({
      //     stakingReward: val,
      //   })
      // );
      console.log("Staking Rewardasssssssss", StakingReward);
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  const handleStakeTime = async () => {
    if (startTime) {
      const date1 = new Date(startTime * 1000);
      console.log("Date 1", date1);
      const diffInDays = Math.floor((new Date() - date1) / 86400000);
      console.log("DiffInDays", diffInDays);
      console.log(
        `The difference between the current time and the given timestamp is ${diffInDays} days.`
      );
      setDays(diffInDays);
    }

    // try {
    //   const stakingReward=await StakeGems.methods.totalReward(stateAddress.address).call();
    //   const val=web3.utils.fromWei(stakingReward, "ether");
    //   // setStakingReward(val);
    //   console.log('Staking Reward', web3.utils.fromWei(stakingReward, "ether"));

    // } catch (error) {
    //   console.log("Error Message", error);
    // }
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    //Staking Reward Functionality
    // try {
    //   const StakingReward = await StakeGems.methods.totalReward(stateAddress.address).call();
    //   // console.log('Staking Reward sssssssssssss',StakingReward);
    //   const val = web3.utils.fromWei(StakingReward, "ether");
    //   setStakingReward(val);
    //   console.log("Staking Reward", StakingReward);
    // } catch (error) {
    //   console.log("Error Message", error);
    // }
  };

  const handleTotalRewardOT = async () => {
    try {
      const totalOvertime = await StakeGems.methods
        .totalRewardedOverTime()
        .call();
      const EthValue = web3.utils.fromWei(totalOvertime, "ether");
      settotalOTClaimedReward(EthValue);
      console.log("OVeritme", totalOvertime);
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  const handleGemReward = async () => {
    try {
      const gemsRewarded = await StakeGems.methods
        .claimedReward(stateAddress.address)
        .call();
      const EthValue = web3.utils.fromWei(gemsRewarded, "ether");
      console.log("Gems Rewarded", EthValue);
      setClaimedReward(EthValue);
      setLoading(false);
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  // useEffect(()=>{
  //   handleGemReward();
  // },[])

  useEffect(() => {
    let intervalId;
    if (stakingReward) {
      intervalId = setInterval(() => {
        StakingReward();
      }, 60000);
    }
    return () => clearInterval(intervalId);
  }, [stakingReward]);

  useEffect(() => {
    setLoading(true);
    handleStakeTime();
    handleGemReward();
    handleTotalRewardOT();
  }, [stateAddress.address, days]);

  useEffect(() => {
    handleGemReward();
    handleTotalRewardOT();
  }, [active]);

  return (
    <div className=" bg-[#141627] text-white h-[calc(100vh-90px)] overflow-auto ">
      <div className="max-w-[130vw] ">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-4 py-6 md:px-6 lg:px-10 xl:px-16 ">
          <div class="col-span-2  bg-liquiditymaskgroup  bg-cover  rounded-[10px]">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 md:ml-20 lg:ml-0 gap-4">
              {StakingData.map((item) => {
                return (
                  <div>
                    {item.id === 3 ? (
                      <>
                        <div className="flex my-4  justify-center md:justify-start lg:justify-start xl:justify-start">
                          <div className="py-4">
                            {!sign.sign ? (
                              <p className="font-bold text-[40px]">N/A</p>
                            ) : loading == true ? (
                              <p className="font-bold text-[40px]">
                                <GridLoader size={10} color="purple" />
                              </p>
                            ) : totalOTClaimedReward == 0 ? (
                              <p className="font-bold md:text-[40px] lg:text-[35px] xl:text-[30px]">
                                0 Gems
                              </p>
                            ) : (
                              <>
                                <p className="text-[30px] font-bold !max-w-[150px]  md:text-[35px] lg:text-[35px] xl:text-[25px]">
                                  {totalOTClaimedReward.includes(".")
                                    ? totalOTClaimedReward.substring(0, 10)
                                    : totalOTClaimedReward}
                                </p>
                                <p>Gems</p>
                              </>
                            )}
                            <p className=" text-gray-400 text-[16px]">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex my-4 justify-center ml-10 md:justify-start lg:justify-start xl:justify-start  md:border-r-2 md:border-[#686ec24f] lg:border-r-2 lg:border-[#686ec24f] xl:border-r-2 xl:border-[#686ec24f]">
                          <div className="py-4">
                            {!sign.sign ? (
                              <>
                                <p className="font-bold text-[40px]">N/A</p>
                                <p className=" text-gray-400 text-[16px]">
                                  {item.desc}
                                </p>
                              </>
                            ) : item.id == 1 ? (
                              <>
                                <div>
                                  {loading == true ? (
                                    <>
                                      <p className="font-bold text-[40px]">
                                        <GridLoader size={10} color="purple" />{" "}
                                        Days
                                      </p>
                                      <p className=" text-gray-400 text-[16px]">
                                        {item.desc}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      {startTime == 0 ? (
                                        <p className="text-[30px] font-bold md:text-[40px] lg:text-[35px] xl:text-[30px]">
                                          0 Days
                                        </p>
                                      ) : (
                                        <p className="text-[30px] font-bold md:text-[40px] lg:text-[35px] xl:text-[30px]">
                                          {/* {days == NaN ? days.replace(NaN, 0) : days} Days */}
                                          {days} Days
                                        </p>
                                      )}
                                      <p className=" text-gray-400 text-[16px]">
                                        {item.desc}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </>
                            ) : item.id == 2 ? (
                              <>
                                {loading == true ? (
                                  <>
                                    <p className="font-bold text-[40px]">
                                      <GridLoader size={10} color="purple" />{" "}
                                      Gems
                                    </p>
                                    <p className=" text-gray-400 text-[16px]">
                                      {item.desc}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="ml-[-35px] text-[30px] font-bold md:text-[35px] lg:text-[35px] xl:text-[30px]">
                                      {stakingReward.includes(".")
                                        ? stakingReward.substring(0, 9)
                                        : stakingReward == 0
                                        ? "0"
                                        : stakingReward}{" "}
                                      BNB
                                    </p>
                                    <p className=" text-gray-400 text-[16px] ml-[-30px]">
                                      {item.desc}
                                    </p>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <p className="font-bold text-[40px]">N/A</p>
                                <p className=" text-gray-400 text-[16px]">
                                  N/A
                                </p>
                              </>
                            )}
                            {/* {item.id == 1 && stateAddress.address ? (
                              <p className="font-bold text-[40px]">
                                {days} Days
                              </p>
                            ) : item.id == 2 && stateAddress.address ? (
                              <p className="font-bold text-[40px]">
                                {item.title}
                              </p>
                            ) : (
                              <p className="font-bold text-[40px]">N/A</p>
                            )} */}
                            {/* <p className="font-bold text-[40px]">
                              {item.title}
                            </p> */}
                            {/* <p className=" text-gray-400 text-[16px]">
                              {item.desc}
                            </p> */}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="row-span-6 rounded-[15px] bg-stackbg bg-cover ">
            <div className="grid grid-cols-1 place-items-center  md:mt-10 lg:mt-0 ">
              <div className="">
                <img
                  src={Matic}
                  alt="gems"
                  className="h-[80px] w-[90px] mt-4 mb-4"
                />
              </div>
              {StackGemRewarded.map((item) => {
                return (
                  <>
                    {!sign.sign ? (
                      <p className="text-[30px] font-semibold ">N/A</p>
                    ) : loading == true ? (
                      <p className="text-[30px] font-semibold ">
                        <GridLoader size={6} color="purple" />
                      </p>
                    ) : (
                      <p className="text-[30px] font-semibold ">
                        {claimedReward.includes(".")
                          ? claimedReward.substring(0, 12)
                          : claimedReward == 0
                          ? "0"
                          : claimedReward}
                      </p>
                    )}
                    <p className="text-[16px]">{item.title}</p>

                    {/* <p className="mb-10 mt-6 text-gray-500 md:text-center ">
                      {item.desc}
                    </p> */}
                  </>
                );
              })}
              <button
                className="relative z-[9999]  rounded-[10px]  text-center py-2 px-4 font-semibold hover:cursor-pointer
                            bg-gradient-to-r mb-10 from-light-violet to-regal-blue mt-6"
                onClick={() => handleClick()}
              >
                {/* 123 */}
                Withdraw Rewards
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-14 md:mt-[-60px] lg:mt-[-120px]">
        <StackTab StackGemsData={StackGemsData} />
      </div>
    </div>

    // </div>
  );
}

export default Staking;
