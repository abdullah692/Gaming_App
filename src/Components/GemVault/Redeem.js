import React, { useState } from "react";
import Web3 from "web3";
import config from "../../config.json";
import { useDispatch, useSelector } from "react-redux";
import {
  storeGEM,
  storeMyWalletGems,
  storeOGI,
  storeWallet,
} from "../reduxtoolkit/smartContract";
import { ClipLoader } from "react-spinners";

function Redeem({ id, filteredSaga }) {
  const [loading, setLoading] = useState(false);
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const dispatch = useDispatch();
  const address = useSelector(
    (state) => state?.rootReducer?.wallet?.address.address
  );
  const LSSVMRouterTokens = new web3.eth.Contract(
    config.LSSVMRouterABI,
    config.LSSVMRouterToken
  );

  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);

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

      const myGems = await NFTContract.methods.walletOfOwner(address).call();
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
      console.log(a, "MyGemsGetRedeem");
      dispatch(
        storeMyWalletGems({
          myGemsWallet: a,
        })
      );
    } catch (error) {
      console.log("Error Message :", error);
    }
  };

  const handleContract = async (id) => {
    console.log("Id is", id);
    setLoading(true);
    try {
      // const NFTLevel = await LSSVMRouterTokens.methods
      //   .getPairByTokenId(config.NFTToken, id)
      //   .call();

      // await NFTContract.methods.approve(NFTLevel, id).send({
      //   from: address,
      // });

      await NFTContract.methods.burnWithOGI(id).send({
        from: address,
      });
      setLoading(false);
      await MyGemsGet();
      await handleUpdate();
      // dispatch()
      // filteredSaga();
    } catch (error) {
      setLoading(false);
      console.log("Error Message", error);
    }
  };

  return (
    <div>
      <div className="md:mt-6 lg:mt-6 xl:mt-8 md:ml-0 lg:ml-[-12px] xl-ml-3 ">
        {/* <BsTag className="m-[4px] mr-[10px] " /> */}
        <button
          className="border-[1px] border-gray-300 rounded-md mt-14 px-6 md:px-2 lg:px-3 xl:px-3 md:text-[10px] lg:text-[14px] py-[2px] my-5 flex cursor-pointer"
          onClick={() => handleContract(id)}
        >
          {loading ? (
            <>
              <ClipLoader size={15} className="mt-1" color="white" />
              <span>&nbsp;Redeem</span>
            </>
          ) : (
            <span>Redeem</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Redeem;
