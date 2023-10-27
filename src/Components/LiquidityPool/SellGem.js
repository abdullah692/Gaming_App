import React,{useState} from "react";
import { BsTag } from "react-icons/bs";
import config from "../../config.json";
import Web3 from "web3";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import BN from "bn.js";
import { ClipLoader } from "react-spinners";
import { storeBNBBuy, storeBNBSell, storeBUSDBuy, storeBUSDSell, storeGEM, storeMarketGems, storeMyGemSell, storeMyWalletGems, storeOGI, storeWallet } from "../reduxtoolkit/smartContract";



function SellGem({ id }) {
  console.log("My Sell", id);

  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const [loading,setLoading]=useState(false);
  const [marketGemsGet, setmarketGemsGet] = useState([]);

  const dispatch=useDispatch();

  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const nftBought = useSelector(
    (state) => state?.rootReducer?.wallet?.nftBought?.nftBought
  );
  console.log('NFT Bought',nftBought);

  const SellValue = useSelector(
    (state) => state?.rootReducer?.wallet?.sellValue.sellValue
  );
  const PancakeRouter = new web3.eth.Contract(
    config.PancakeRouterABI,
    config.PancakeRouterToken
  );
  const LinearCurveTokens = new web3.eth.Contract(
    config.LinearCurveABI,
    config.LinearCurveToken
  );


  const LSSVMRouterTokens = new web3.eth.Contract(
    config.LSSVMRouterABI,
    config.LSSVMRouterToken
  );
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);

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
                level: sizeToLevel(x.size)
              };
              return value;
            });
          // console.log(abc, "abc");
          // setAllData(prev => ([...prev, {...abc, gem_id: val}]))
          return { ...abc, id: val };
        })
      );
      console.log(a, "MyGemsGet");
      // setSize(a);
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
                level: sizeToLevel(x.size)
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
  


  
  const handleSellLinearCurve =async(event,id)=>{
    event.stopPropagation();
    setLoading(true);
    var date = new Date();
    var deadline = Math.floor(date.getTime() / 1000) + 300;
    try {
      const SetApproval=await NFTContract.methods
      .setApprovalForAll(config.LSSVMRouterToken, true)
      .send({
        from: stateAddress.address,
      });
      console.log('Id in Sell',id);
      console.log('SetApproval',SetApproval);
      
      const ids =+id;
      console.log('Ids',ids);
      //Add  this condition for level

      const NFTLevelAddress=await LSSVMRouterTokens.methods
      .getPairByTokenId(config.NFTToken,ids).call();
      console.log('NFTLevelAddress Address',NFTLevelAddress);

      const getSellValue=await LSSVMRouterTokens.methods.
      getSellPairCost([[NFTLevelAddress,["1"]]])
      .call();
      console.log('GetSellValue',getSellValue);
      const SellGem= await LSSVMRouterTokens.methods
            .swapNFTsForToken(
              [[NFTLevelAddress,[ids]]],
              config.NFTToken,
              getSellValue,
              stateAddress.address,
              deadline
            )
            .send({
              from: stateAddress.address,
            });
            console.log('Sell Gems',SellGem);
            setLoading(false);
           await MyGemsGet();
           await MarketGemsGet();
           await handleUpdate();
      
    } catch (error) {
          console.log("Error Messaage", error);
          setLoading(false);
    }
  }
  return (
    <div>
      <button
        className="border-[1px] border-gray-300 rounded-[10px] md:px-2 lg:px-3  xl:px-6 px-[25px] md:text-[10px] lg:text-[14px]   py-[2px]  flex  "
        onClick={(event) => handleSellLinearCurve(event,id)}
        // key={index}
      >
        {/* <BsTag className="m-[4px]" />
        Sell */}

        { loading ? (
          <>
          <ClipLoader size={15} className="mt-1" color="white"/> &nbsp; Sell
          </>
        ):(
          <span className="flex"><BsTag className="m-[4px]" /> Sell</span>
        )
      }
      </button>
    </div>
  );
}

export default SellGem;
