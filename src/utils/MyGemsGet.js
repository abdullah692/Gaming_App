import { storeMyWalletGems } from "../Components/reduxtoolkit/smartContract";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import config from "../config.json"

export const MyGemsGet = async () => {
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const dispatch = useDispatch();
  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);

  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address
  );
  let a;
  try {
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
