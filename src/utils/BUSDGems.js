import config from "../config.json"
import Web3 from "web3";

export async function BNBBuy(value)  {
try {
    
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
    const PancakeRouter = new web3.eth.Contract(
        config.PancakeRouterABI,
        config.PancakeRouterToken
      );
    const BNBtoBUSD = await PancakeRouter.methods
    .getAmountsOut(value, [
        config.BNBToken.toString(),
      config.BUSDToken.toString(),
    //   config.OGIToken.toString(),
    ]).call();
    console.log("BNBtoBUSD", BNBtoBUSD);
    const BNBtoBUSDEth = web3.utils.fromWei(BNBtoBUSD[1], "ether");
    console.log("ogiBUSDaaaa", BNBtoBUSDEth);
    return BNBtoBUSDEth;
    
} catch (error) {
    console.log('Error Message',error);
}
}