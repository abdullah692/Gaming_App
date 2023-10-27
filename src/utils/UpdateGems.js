// import Web3 from "web3";
// import {
//   storeGEM,
//   storeOGI,
//   storeWallet,
// } from "../Components/reduxtoolkit/smartContract";
// import config from "../config.json";
// import { useDispatch, useSelector } from "react-redux";



// export const handleUpdate = async () => {

    
//   const { ethereum } = window;
  

//   const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
//   const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);
//   const web3 = new Web3(ethereum);
//   let balanceInEther;
//   const balanceInWei = await web3.eth.getBalance(stateAddress.address);
//   console.log("Balance in Wei", balanceInWei);
//   balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
//   console.log("Balance in Ether", balanceInEther);
//   const OGIS = await OGITokens.methods.balanceOf(stateAddress.address).call();
//   const OGI = web3.utils.fromWei(OGIS, "ether");
//   console.log("OGIS", OGI);
//   const Gems = await NFTContract.methods
//     .walletOfOwner(stateAddress.address)
//     .call();
//   console.log("Gems", Gems.length);
//   dispatch(storeWallet({ wallet: balanceInEther }));
//   dispatch(storeOGI({ ogi: OGI }));
//   dispatch(storeGEM({ gems: Gems.length }));
// };
