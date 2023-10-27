import React, { useEffect, useState } from "react";
import Web3 from "web3";
import config from "../../config.json";
import { useSelector, useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import {
  setLoadingForAgainFetch,
  storeGEM,
  storeMsg,
  storeOGI,
  storeWallet,
} from "../reduxtoolkit/smartContract";
import { Modal } from "antd";
import { storeMyWalletGems } from "../reduxtoolkit/smartContract";

const MintButton = () => {
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const loadingForAgainFetch = useSelector(
    (state) => state?.rootReducer?.wallet?.loadingForAgainFetch
  );

  const [loading, setLoading] = useState(false);
  const [numGems, setNumGems] = useState("");
  const [ogiMint, setOgiMint] = useState("0");
  const [msg, setMsg] = useState(true);
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const GEMTokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
  const address = useSelector((state) => state?.rootReducer?.wallet?.address);

  const handleUpdate = async () => {
    let balanceInEther;
    const balanceInWei = await web3.eth.getBalance(stateAddress.address);
    console.log("Balance in Wei", balanceInWei);
    balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
    console.log("Balance in Ether", balanceInEther);
    const OGIS = await OGITokens.methods.balanceOf(stateAddress.address).call();
    const OGI = web3.utils.fromWei(OGIS, "ether");
    console.log("OGIS", OGI);
    const Gems = await NFTContract.methods
      .walletOfOwner(stateAddress.address)
      .call();
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
      console.log(myGems, "myGemsData");

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
      console.log(a, "MyGemsGetMint");
      dispatch(
        storeMyWalletGems({
          myGemsWallet: a,
        })
      );
    } catch (error) {
      console.log("Error Message :", error);
    }
  };

  const handlePopup = () => {
    setIsModalOpen(true);
    setNumGems("");
  };

  const handleSend = async () => {
    setLoading(true);
    // let msg=1;
    console.log("Mint ether", web3.utils.toWei("10", "ether"));
    try {
      await GEMTokens.methods
        .approve(config.NFTToken, web3.utils.toWei("10", "ether"))
        .send({
          from: stateAddress.address,
        });

      // .on("receipt", async (val) => {
      //   // alert('Approved')
      //   console.log("Approved");
      await NFTContract.methods
        .mintWithOGI(stateAddress.address, numGems)
        .send({
          from: stateAddress.address,
        });
      // });
      console.log("Mint button clicked");
      setLoading(false);
      setIsModalOpen(false);
      setNumGems("");
      await MyGemsGet();
      await handleUpdate();
      dispatch(setLoadingForAgainFetch({ loadingForAgainFetch }));
      // msg++;
      // dispatch(storeMsg({ msg: msg }));
    } catch (error) {
      // alert("Error Message",error)
      setLoading(false);
      console.log("Error Message", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const result = inputValue * 10;
    setNumGems(inputValue);
    setOgiMint(result);
  };
  console.log("Num Gems", numGems);
  // useEffect(()=>{
  //   MyGemsGet();
  // },[msg])

  return (
    <>
      <button
        className="px-[80px] py-3 mt-2 rounded-[5px] text-center font-semibold text-[15px] 
          bg-gradient-to-r  from-light-violet to-regal-blue"
        onClick={handlePopup}
      >
        Mint
      </button>
      {isModalOpen ? (
        <>
          <Modal
            open={isModalOpen}
            footer={null}
            // onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className="">
              <div className="m-5">
                <p className=" text-[25px] text-center text-white">
                  Enter the number of Gems you want to mint
                </p>
              </div>
              <div className="text-center ">
                <input
                  type="number"
                  placeholder="Num of Gems"
                  value={numGems}
                  className="rounded-md w-[100%] md:w-[60%] lg:w-[60%] xl:w-[65%]  bg-[#1e213cb3] text-white"
                  onChange={handleChange}
                />
                <br />
                {!numGems ? (
                  <button className="my-6  px-[27px] py-[12px] text-[16px] rounded-[10px] text-white bg-gradient-to-r  from-light-violet to-regal-blue opacity-50">
                    Confirm
                  </button>
                ) : (
                  <button
                    className="my-6  px-[27px] py-[12px] text-[16px] rounded-[10px] text-white bg-gradient-to-r  from-light-violet to-regal-blue"
                    onClick={handleSend}
                  >
                    {loading ? (
                      <>
                        <ClipLoader size={15} className="mt-1" color="white" />{" "}
                        &nbsp; Confirm
                      </>
                    ) : (
                      <span>Confirm</span>
                    )}
                  </button>
                )}
                {/* <br />
                <button
                  className=" border-2 border-white px-[30px] py-[12px] text-[16px] rounded-[10px] text-white"
                  onClick={handleCancel}
                >
                  Cancel
                </button> */}
                <div className="mt-2 mb-4">
                  <p className="text-white text-[16px]">
                    You will have to approve spending for {ogiMint} $OGI before
                    minting
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default MintButton;
