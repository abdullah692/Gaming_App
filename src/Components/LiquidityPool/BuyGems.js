import React, { useState } from "react";
import { BsTag } from "react-icons/bs";
import Web3 from "web3";
import config from "../../config.json";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoadingForAgainFetch,
  storeBNBBuy,
  storeBNBSell,
  storeBUSDBuy,
  storeBUSDSell,
  storeGEM,
  storeInputValue,
  storeMyGemSell,
  storeMyWalletGems,
  storeNewSpotPrice,
  storeOGI,
  storeWallet,
} from "../reduxtoolkit/smartContract";
import axios from "axios";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import { ClipLoader } from "react-spinners";
import { storeMarketGems } from "../reduxtoolkit/smartContract";
import { MyGemsGet } from "../../utils/MyGemsGet";

function BuyGems({ id }) {
  // console.log('Index Value',id)
  const [loading, setLoading] = useState(false);
  const [marketGemsGet, setmarketGemsGet] = useState([]);

  const stateInputValue = useSelector(
    (state) => state?.rootReducer?.buyGem?.inputValue
  );

  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );

  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const loadingForAgainFetch = useSelector(
    (state) => state?.rootReducer?.wallet?.loadingForAgainFetch
  );

  const [size, setSize] = useState([]);
  const [auth, setAuth] = useState();

  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const dispatch = useDispatch();
  const LinearCurveTokens = new web3.eth.Contract(
    config.LinearCurveABI,
    config.LinearCurveToken
  );

  const LSSVMRouterTokens = new web3.eth.Contract(
    config.LSSVMRouterABI,
    config.LSSVMRouterToken
  );
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );

  const MarketGemsGet = async () => {
    let b;
    let busd;

    try {
      const sizeToLevel = (size) => {
        return Math.log2(size) + 1;
      };
      const pairAddresses = [
        config.Level01Token,
        config.Level02Token,
        config.Level03Token,
        config.Level04Token,
      ];
      let marketGemsDataArray = [];

      // pairAddresses.forEach(async (pairAddress) => {
      //   const marketGemsData = await NFTContract.methods
      //     .walletOfOwner(pairAddress)
      //     .call();
      //   console.log(marketGemsData, "marketGemsData");
      //   marketGemsDataArray.push(...marketGemsData);
      //   console.log("Market Gems 1111", marketGemsDataArray);
      //   setmarketGemsGet(marketGemsDataArray);
      // });
      // let flattenedArray;
      // Promise.all(pairAddresses.map(async (pairAddress) => {
      //   const marketGemsData = await NFTContract.methods
      //     .walletOfOwner(pairAddress)
      //     .call();
      //   console.log(marketGemsData, "marketGemsData");
      //   return marketGemsData;
      // })).then((marketGemsDataArray) => {
      //    flattenedArray = marketGemsDataArray.flat();
      //   console.log("Market Gems 1111", flattenedArray);
      //   setmarketGemsGet(flattenedArray);
      // })


      // console.log('dataVal',flattenedArray);
      // b = await Promise.all(
      //   await marketGemsGet?.map(async (val) => {
      //     let abc = await NFTContract.methods
      //       .tokenIdInfo(val)
      //       .call()
      //       .then((x) => {
      //         const value = {
      //           ...x,
      //           valueMulBy10: parseFloat(x.size) * 10,
      //           // level: sizeToLevel(x.size)
      //         };
      //         return value;
      //       });
      //     return { ...abc, id: val };
      //   })
      // );
      Promise.all(pairAddresses.map(async (pairAddress) => {
        const marketGemsData = await NFTContract.methods.walletOfOwner(pairAddress).call();
        console.log(marketGemsData, "marketGemsData");
        return marketGemsData;
      })).then((marketGemsDataArray) => {
        const flattenedArray = marketGemsDataArray.flat();
        console.log("Market Gems 1111", flattenedArray);
      
        setmarketGemsGet(flattenedArray);
      debugger
        Promise.all(
          flattenedArray.map(async (val) => {
            let abc = await NFTContract.methods.tokenIdInfo(val).call().then((x) => {
              const value = {
                ...x,
                valueMulBy10: parseFloat(x.size) * 10,
                // level: sizeToLevel(x.size)
              };
              return value;
            });
            return { ...abc, id: val };
          })
        ).then((b) => {
          console.log('dataVal', b);
          dispatch(storeMarketGems({ marketGemsWallet:b}));
        });
      });
     
      console.log(b, "MyMarketGemsGetNew");
      // setmarketGemsGet(updatedMarketGems);

      // console.log(b, "MyMarketGemsGetNew");
      
    } catch (error) {
      console.log("Error Message :", error);
    }
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

  const BNBSell = async (size) => {
    try {
      const getSellValue = await LSSVMRouterTokens.methods
        .getSellPairCost([[config.PairCostToken, ["1"]]])
        .call();
      console.log("GetSellValue", getSellValue);
      let result = (Math.pow(2, size - 1) * getSellValue).toString();
      const val = web3.utils.toWei(getSellValue, "ether");
      console.log("result", result);

      const BNBToken = config.BNBToken;
      const OGIToken = config.OGIToken;
      const OGItoBNB = await PancakeRouter.methods
        .getAmountsOut(result, [BNBToken, config.BUSDToken])
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

  // const BNBSell = async () => {
  //   try {
  //     const getSellValue = await LSSVMRouterTokens.methods
  //       .getSellPairCost([[config.PairCostToken, ["1"]]])
  //       .call();
  //     console.log("GetSellValue", getSellValue);
  //     const val = web3.utils.toWei(getSellValue, "ether");
  //     console.log('val',val);
  //     const BNBToken = config.BNBToken;
  //     const OGIToken = config.OGIToken;
  //     const OGItoBNB = await PancakeRouter.methods
  //       .getAmountsOut(getSellValue,[BNBToken, config.BUSDToken])
  //       .call();
  //       const OGItoBNBEth = web3.utils.fromWei(OGItoBNB[1], "ether");
  //       dispatch(
  //         storeBNBSell({
  //           ogiBNBSell: OGItoBNBEth,
  //         })
  //       );
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
  //     dispatch(
  //       storeBUSDSell({
  //         ogiBUSDSell: BNBtoBUSDEth,
  //       })
  //     );
  //     // setOgiBUSD(BNBtoBUSDEth);
  //   } catch (error) {
  //     console.log("Error Message", error);
  //   }
  // };

  const BNBBuy = async () => {
    try {
      const getBuyValue = await LSSVMRouterTokens.methods
        .getBuyPairCost([[config.PairCostToken, ["1"]]], 2)
        .call();
      console.log("GetBuyValue", getBuyValue);
      const BNBToken = config.BNBToken;
      const OGIToken = config.OGIToken;

      const OGItoBNB = await PancakeRouter.methods
        .getAmountsOut(getBuyValue, [BNBToken, config.BUSDToken])
        .call();
      const OGItoBNBEth = web3.utils.fromWei(OGItoBNB[1], "ether");
      dispatch(
        storeBNBBuy({
          ogiBNBBuy: OGItoBNBEth,
        })
      );
      console.log("bnb Buy", OGItoBNBEth);

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
      dispatch(
        storeBUSDBuy({
          ogiBUSDBuy: BNBtoBUSDEth,
        })
      );
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  // const MyGemsGet = async () => {
  //   let a;
  //   try {
  //     const apiReS = await axios.post(
  //       "https://api.1lab.network/api/auth/dapp",

  //       {
  //         wallet: stateAddress.address,
  //         sign: sign,
  //       },
  //       { withCredentials: true }
  //     );
  //     console.log("Api Auth buyInfo Brack res", apiReS.data);

  //     const boughtNft = await axios.get(
  //       `https://api.1lab.network/api/boughtnfts/${stateAddress.address}`,
  //       { withCredentials: true }
  //       // {withCredentials:true}
  //     );
  //     console.log("Response", boughtNft.data);
  //     const array = boughtNft.data.data;
  //     const myGems = array.map((x) => x.nft_id);
  //     // setGemData(myGemsData)
  //     console.log(myGems, "myGemsData");
  //     let a;
  //     a = await Promise.all(
  //       await myGems?.map(async (val) => {
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
  //     console.log(a, "MyGemsGetadsds");
  //     dispatch(storeMyGemSell({ myGemSell: a }));
  //   } catch (error) {
  //     console.log("Error Message :", error);
  //   }
  // };
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

  const handleLinearCurve = async (id) => {
    console.log("Sign", sign);
    console.log("idsssssssssssss", id);
    if (stateAddress.address) {
      try {
        setLoading(true);
        var date = new Date();
        var deadline = Math.floor(date.getTime() / 1000) + 300;
        console.log('deadline',deadline);
        //Add  this condition for level

        const NFTLevelAddress = await LSSVMRouterTokens.methods
          .getPairByTokenId(config.NFTToken, id)
          .call();
        console.log("NFTLevelAddress Address", NFTLevelAddress);

        const getBuyValue = await LSSVMRouterTokens.methods
          .getBuyPairCost([[NFTLevelAddress, ["1"]]], 2)
          .call();
        console.log("Get buy value", getBuyValue);
        await LSSVMRouterTokens.methods
          .swapETHForSpecificNFTs(
            [[NFTLevelAddress, [id]]],
            config.NFTToken,
            stateAddress.address,
            stateAddress.address,
            deadline
          )
          .send({
            from: stateAddress.address,
            value: getBuyValue,
            // gasPrice: web3.utils.toWei('56', 'gwei'),
          });
        setLoading(false);
        // await BNBSell();
        // await BNBBuy();
        await MarketGemsGet();
        await MyGemsGet();
        // await BNBSell(size.size)
        await handleUpdate();
        dispatch(setLoadingForAgainFetch({ loadingForAgainFetch }));
      } catch (error) {
        setLoading(false);
        console.log("Error Message", error);
      }
    } else {
      alert("First Connect to the wallet");
    }
  };

  return (
    <div className="mt-6 md:mt-6 lg:mt-6 xl:mt-8  md:ml-0 lg:ml-0 xl:ml-7">
      <button
        className="border-[1px] border-gray-300 rounded-[10px]  px-3 md:px-1 lg:px-1 xl:px-3 md:text-[10px] lg:text-[14px] py-[2px] my-5 flex cursor-pointer"
        onClick={() => handleLinearCurve(id)}
      >
        {loading ? (
          <>
            <ClipLoader size={15} className="mt-1" color="white" /> &nbsp; Buy
          </>
        ) : (
          <span className="flex">
            <BsTag className="m-[4px]" /> Buy
          </span>
        )}
      </button>
    </div>
  );
}

export default BuyGems;
