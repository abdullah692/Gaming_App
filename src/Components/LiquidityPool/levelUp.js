import React, { useState } from "react";
import { FiRepeat } from "react-icons/fi";
import Web3 from "web3";
import config from "../../config.json";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Space } from "antd";
import { CustomNotification } from "../../utils/Notification";
import {
  storeGEM,
  storeMyGemSell,
  storeMyWalletGems,
  storeOGI,
  storeWallet,
} from "../reduxtoolkit/smartContract";
import axios from "axios";
import { Modal } from "antd";
import { ClipLoader } from "react-spinners";

function LevelUp({ merge }) {
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);

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
      console.log(a, "MyGemsGetLevel");

      dispatch(
        storeMyWalletGems({
          myGemsWallet: a,
        })
      );
    } catch (error) {
      console.log("Error Message :", error);
    }
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const levelUp = await NFTContract.methods
        .Merge(merge[0].id, merge[1].id)
        .send({
          from: stateAddress.address,
        });
      console.log("Level Up", levelUp);

      await MyGemsGet();
      await handleUpdate();
      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error Message", error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePopup = async (event, merge) => {
    event.stopPropagation();
    if (merge.length == 1) {
      CustomNotification("error", "Please select another Nft of same level");
      console.log("Please select another level 01 nft");
    } else {
      setIsModalOpen(true);
    }
    // console.log("Merge is", merge[0].id);
    // console.log("Merge is", merge[1].id);
  };
  return (
    <div className="">
      <button
        // className="border-[1px] border-gray-300 rounded-[10px] px-3 md:px-1 lg:px-1 xl:px-3  md:text-[10px] lg:text-[14px]  py-[2px] my-5 flex"
        className="rounded-[10px] flex text-white  text-center py-1 px-4 mr-4 mt-4 font-semibold
        bg-gradient-to-r  from-light-violet to-regal-blue"
        onClick={(event) => handlePopup(event, merge)}
      >
        <FiRepeat className="m-[4px]" />
        Level Up
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
                  Are you sure, you want to level up these gems?
                </p>
              </div>
              <div className="text-center ">
                <button
                  className="my-6  px-[27px] py-[12px] text-[16px] rounded-[10px] text-white bg-gradient-to-r  from-light-violet to-regal-blue"
                  onClick={handleOk}
                >
                  {loading ? (
                    <>
                      <ClipLoader size={15} className="mt-1" color="white" />{" "}
                      &nbsp; Confirm
                    </>
                  ) : (
                    <span className="flex">Confirm</span>
                  )}
                </button>
                <br />
                <button
                  className=" border-2 border-white px-[30px] py-[12px] text-[16px] rounded-[10px] text-white"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default LevelUp;
