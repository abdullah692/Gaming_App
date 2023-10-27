import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import {
  storeWallet,
  storeAddress,
  storeGEM,
  storeOGI,
  storeSign,
  storeMyWalletGems,
  storeMarketGems,
  storeMyGemSell,
  storeSellValue,
  storeNftBought,
  storeBuyValue,
  storeBUSD,
  storeBUSDBuy,
  storeBNBSell,
  storeBUSDSell,
  storeBNBBuy,
} from "../reduxtoolkit/smartContract";
import config from "../../config.json";
import axios from "axios";

const ConnectMetaMask = () => {
  // const state = useSelector((state) => state?.wallet?.wallet);

  // const OGIToken = process.env.REACT_APP_OGI_TOKEN_CONTRACT;
  // console.log("OGI Token", OGIToken);
  // console.log("state Address",stateAddress)

  // var balanceInEther;
  const [address, setAddress] = useState("");
  const [sign, setSign] = useState("");
  const [myGems, setMyGems] = useState([]);
  const [marketGemsGet, setmarketGemsGet] = useState([]);
  const [ogiBUSD, setOgiBUSD] = useState("");

  const dispatch = useDispatch();
  let balanceInEther;

  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
  }
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
  const LSSVMRouterTokens = new web3.eth.Contract(
    config.LSSVMRouterABI,
    config.LSSVMRouterToken
  );
  // console.log("GEMTokens", GEMTokens);

  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );

  // Example usage
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const selectedAccount = accounts[0];
        console.log("Connected to wallet: " + selectedAccount);
        setAddress(selectedAccount);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      window.open("https://metamask.app.link/dapp/dapp.1lab.network");
    }
  };

  const handleMetaMask = async () => {
    await connectWallet();
  };
  async function getBalance() {
    const message = "Please sign this to login..";

    const balanceInWei = await web3.eth.getBalance(address);
    console.log("Balance in Wei", balanceInWei);
    balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
    console.log("Balance in Ether", balanceInEther);
    const OGIS = await OGITokens.methods.balanceOf(address).call();
    const OGI = web3.utils.fromWei(OGIS, "ether");
    console.log("OGIS", OGI);
    const Gems = await NFTContract.methods.walletOfOwner(address).call();
    console.log("Gems", Gems.length);
    // const GemWalletHold=await NFTContract.methods.count().call();
    // const OgiWalletHold=await OGITokens.methods.count().call();
    // const tvlGems=await NFTContract.methods.getTVL().call();
    // console.log('Gem Wallet Holding',GemWalletHold);
    // console.log('Ogi Wallet Holding',OgiWalletHold);
    // console.log('tvl Gems',tvlGems);

    const login = async address => {
      try {
        const from = address;
        console.log("from : " + from);
        const signs = await web3.eth.personal.sign(message, from);
        dispatch(storeSign({ sign: signs }));
        console.log("sign : ", signs);

        //Product api for Sell MyGem
        // const apiReS = await axios.post(
        //   "https://api.1lab.network/api/auth/dapp",

        //   {
        //     wallet: address,
        //     sign: signs,
        //   },
        //   { withCredentials: true }
        // );
        // console.log("Api Auth buyInfo Brack res", apiReS.data);

        // const boughtNft = await axios.get(
        //   `https://api.1lab.network/api/boughtnfts/${address}`,
        //   { withCredentials: true }
        //   // {withCredentials:true}
        // );
        // console.log("Response", boughtNft.data);
        // const array = boughtNft.data.data;
        // const myGems = array.map((x) => x.nft_id);
        // // setGemData(myGemsData)
        // console.log(myGems, "myGemsData");
        // let a;
        // a = await Promise.all(
        //   await myGems?.map(async (val) => {
        //     let abc = await NFTContract.methods
        //       .tokenIdInfo(val)
        //       .call()
        //       .then((x) => {
        //         return x;
        //       });
        //     // console.log(abc, "abc");
        //     // setAllData(prev => ([...prev, {...abc, gem_id: val}]))
        //     return { ...abc, id: val };
        //   })
        // );
        // console.log(a, "MyGemsGet");
        // dispatch(storeMyGemSell({ myGemSell: a }));
        // dispatch(storeNftBought({ nftBought: array }));

        // setSign(signs)
      } catch (err) {
        console.error(err);
      }
    };
    login(address);
    try {
      const getBuyValue = await LSSVMRouterTokens.methods
        .getBuyPairCost([[config.PairCostToken, ["1"]]], 2)
        .call();
      console.log("Get buy value", getBuyValue);
      const getSellValue = await LSSVMRouterTokens.methods
        .getSellPairCost([[config.PairCostToken, ["1"]]])
        .call();
      console.log("Get Sell value", getBuyValue);
      const buyValue = web3.utils.fromWei(getBuyValue, "ether");
      const sellValue = web3.utils.fromWei(getSellValue, "ether");
      console.log("buyValue", buyValue);
      console.log("sellValue", sellValue);
      dispatch(storeBuyValue({ buyValue: buyValue }));
      dispatch(storeSellValue({ sellValue: sellValue }));
    } catch (error) {
      console.error(error);
    }
    console.log("Sign Address is", sign);
    dispatch(storeAddress({ address: address }));
    dispatch(storeWallet({ wallet: balanceInEther }));
    dispatch(storeOGI({ ogi: OGI }));
    dispatch(storeGEM({ gems: Gems.length }));
    // dispatch(storeNFTHold({ NFTHold: GemWalletHold }));
    // dispatch(storeGEM({ gems: Gems.length }));
    // dispatch(storeGEM({ gems: Gems.length }));
  }

  const BNBSell = async () => {
    try {
      const getSellValue = await LSSVMRouterTokens.methods
        .getSellPairCost([[config.PairCostToken, ["1"]]])
        .call();
      console.log("GetSellValue", getSellValue);
      let result = (Math.pow(2, 2 - 1) * getSellValue).toString();
      const val = web3.utils.toWei(getSellValue, "ether");
      console.log("result", result);

      const BNBToken = config.BNBToken;
      const OGIToken = config.OGIToken;
      const OGItoBNB = await PancakeRouter.methods
        .getAmountsOut(result, [BNBToken, config.BUSDToken])
        .call();
      const OGItoBNBEth = web3.utils.fromWei(OGItoBNB[1], "ether");
      dispatch(
        storeBNBSell({
          ogiBNBSell: OGItoBNBEth,
        })
      );
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
      dispatch(
        storeBUSDSell({
          ogiBUSDSell: BNBtoBUSDEth,
        })
      );
      // setOgiBUSD(BNBtoBUSDEth);
    } catch (error) {
      console.log("Error Message", error);
    }
  };

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
      // console.log("ogiBUSDaaaa", BNBtoBUSDEth);
      dispatch(
        storeBUSDBuy({
          ogiBUSDBuy: BNBtoBUSDEth,
        })
      );
    } catch (error) {
      console.log("Error Message", error);
    }
  };

  const MyGemsGet = async () => {
    let a;
    try {
      const sizeToLevel = size => {
        return Math.log2(size) + 1;
      };

      const myGems = await NFTContract.methods.walletOfOwner(address).call();
      // const myGems = array.map(x => x.nft_id
      //   );
      // setGemData(myGemsData)
      console.log(myGems, "myGemsData");

      a = await Promise.all(
        await myGems?.map(async val => {
          let abc = await NFTContract.methods
            .tokenIdInfo(val)
            .call()
            .then(x => {
              const value = {
                ...x,
                valueMulBy10: parseFloat(x.size) * 10,
                level: sizeToLevel(x.size),
              };
              return value;
            });

          return { ...abc, id: val };
        })
      );
      console.log(a, "MyGemsGetNew");
      dispatch(
        storeMyWalletGems({
          myGemsWallet: a,
        })
      );
    } catch (error) {
      console.log("Error Message :", error);
    }
  };

  const MarketGemsGet = async () => {
    let b;
    let busd;

    try {
      const sizeToLevel = size => {
        return Math.log2(size) + 1;
      };
      const pairAddresses = [
        config.Level01Token,
        config.Level02Token,
        config.Level03Token,
        config.Level04Token,
      ];
      let marketGemsDataArray = [];

      pairAddresses.forEach(async pairAddress => {
        const marketGemsData = await NFTContract.methods
          .walletOfOwner(pairAddress)
          .call();
        console.log(marketGemsData, "marketGemsData");
        marketGemsDataArray.push(...marketGemsData);
        console.log("Market Gems 1111", marketGemsDataArray);
        setmarketGemsGet(marketGemsDataArray);
      });
      // const marketGemsDataArray = await Promise.all(pairAddresses.map(async (pairAddress) => {
      //   const marketGemsData = await NFTContract.methods.walletOfOwner(pairAddress).call();
      //   return [...marketGemsData];
      // }));
      // const MarketGemsData = await NFTContract.methods
      //   .walletOfOwner(config.PairAddressToken)
      //   .call();

      b = await Promise.all(
        await marketGemsGet?.map(async val => {
          let abc = await NFTContract.methods
            .tokenIdInfo(val)
            .call()
            .then(x => {
              const value = {
                ...x,
                valueMulBy10: parseFloat(x.size) * 10,
                level: sizeToLevel(x.size),
              };
              return value;
            });
          return { ...abc, id: val };
        })
      );

      // const newArray = b.map(obj => ({
      //   ...obj,
      //   level: sizeToLevel(obj.size)
      // }));
      console.log(b, "MyMarketGemsGetNew");
      dispatch(storeMarketGems({ marketGemsWallet: b }));
    } catch (error) {
      console.log("Error Message :", error);
    }
  };

  useEffect(() => {
    getBalance();
    MyGemsGet();
    // BNBSell();
    BNBBuy();
    // await MyGemsSell();
    MarketGemsGet();
  }, [address]);

  // console.log("Address", address);
  return (
    <>
      <button
        className={` h-[40px] rounded-[10px] mt-10 text-center 
          bg-gradient-to-r  from-light-violet to-regal-blue mr-2 px-2 md:px-4 ${
            address ? "text-xs" : ""
          }`}
        onClick={handleMetaMask}
      >
        {!address
          ? "Connect"
          : `${
              address.substr(0, 6) + "..." + address.substring(address.length - 6)
            }`}
      </button>
    </>
  );
};

export default ConnectMetaMask;
// export const {MyGemsGet}=MyGemsGet;
