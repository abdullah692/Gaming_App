
import { storeMyWalletGems } from "../reduxtoolkit/smartContract";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import config from "../../config.json"

export const  MyGemsGet = async () => {
    const { ethereum } = window;
    const web3 = new Web3(ethereum);
    const NFTContract=new web3.eth.Contract(config.NFTABI,config.NFTToken);
    
    const address = useSelector((state) => state?.rootReducer?.wallet?.address);
    const dispatch=useDispatch();
    let a;
    try {
      const myGems = await NFTContract.methods.walletOfOwner(address.address).call();
      // const myGems = array.map(x => x.nft_id
      //   );
      // setGemData(myGemsData)
      console.log(myGems, "myGemsData");

      a = await Promise.all(
        await myGems?.map(async (val) => {
          let abc = await NFTContract.methods
            .tokenIdInfo(val)
            .call()
            .then((x) => {
              return x;
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
