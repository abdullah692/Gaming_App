import { createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

const intialState = {
  wallet: "",
  address: "",
  ogi: "",
  gems: "",
  sign: "",
  startTime: "",
  endTime:"",
  myGemsWallet: "",
  msg: "",
  marketGemsWallet: "",
  myGemSell:"",
  nftBought:"",
  buyValue:"",
  sellValue:"",
  BNBSell:"",
  BUSDSell: "",
  BNBBuy:"",
  BUSDBuy: "",
  loadingForAgainFetch: false,
  stakingReward:false,
  unStake:false
  // TVLGem: "",
};

const initailStateBuyGem = {
  inputValue: "",
  newSpotPrice: "",
};

const initailStateSaga = {
  // saga: "1",
  sagaMyGems: "1",
  sagaMarketGems: "1",
  sagaGemVault: "1",
};
export const smartContractSlice = createSlice({
  name: "wallet",
  initialState: intialState,
  reducers: {
    storeWallet: (state, action) => {
      state.wallet = action.payload;
      // state.address=action.payload
    },
    storeAddress: (state, action) => {
      state.address = action.payload;
    },
    storeOGI: (state, action) => {
      state.ogi = action.payload;
    },
    storeGEM: (state, action) => {
      state.gems = action.payload;
    },
    storeSign: (state, action) => {
      state.sign = action.payload;
    },
    storeSign: (state, action) => {
      state.sign = action.payload;
    },
    storeStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    storeEndTime: (state, action) => {
      state.endTime = action.payload;
    },
    storeMyWalletGems: (state, action) => {
      console.log("storeMyWalletGems", action.payload);
      state.myGemsWallet = action.payload;
    },
    storeMsg: (state, action) => {
      state.msg = action.payload;
    },
    storeMarketGems: (state, action) => {
      console.log("storeMarketGems:payload", action.payload);
      state.marketGemsWallet = action.payload;
    },
    storeMyGemSell:(state, action) => {
      console.log('mySelldasds',action.payload);
      state.myGemSell = action.payload;
    },
    storeNftBought:(state, action) => {
      state.nftBought = action.payload;
    },
    storeBuyValue:(state, action) => {
      state.buyValue = action.payload;
    },
    storeSellValue:(state, action) => {
      state.sellValue = action.payload;
    },
    storeBNBSell: (state, action) => {
      state.BNBSell = action.payload;
    },
    storeBUSDSell: (state, action) => {
      state.BUSDSell = action.payload;
    },
    storeBNBBuy: (state, action) => {
      state.BNBBuy = action.payload;
    },
    storeBUSDBuy: (state, action) => {
      state.BUSDBuy = action.payload;
    },
    setLoadingForAgainFetch: (state, action) => {
      
      state.loadingForAgainFetch = !action.payload
    },
    storeStakingReward:(state,action)=>{
      state.stakingReward=action.payload
    },
   
   
    // storeTVLGem: (state, action) => {
    //   state.TVLGem = action.payload;
    // },
  },
});

export const buyGemsSlice = createSlice({
  name: "buyGem",
  initialState: initailStateBuyGem,
  reducers: {
    storeInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    storeNewSpotPrice: (state, action) => {
      state.newSpotPrice = action.payload;
    },
  },
});

export const sagaSlice = createSlice({
  name: "saga",
  initialState: initailStateSaga,
  reducers: {
    storeSaga: (state, action) => {
      console.log(action.payload, "myPayload");
      if (action.payload.sagaMyGems) {
        state.sagaMyGems = action.payload.sagaMyGems;
      } else if (action.payload.sagaMarketGems) {
        state.sagaMarketGems = action.payload.sagaMarketGems;
      } else if (action.payload.sagaGemVault) {
        state.sagaGemVault = action.payload.sagaGemVault;
      }
    },
  },
});

const rootReducer = combineReducers({
  wallet: smartContractSlice.reducer,
  buyGem: buyGemsSlice.reducer,
  saga: sagaSlice.reducer,
});

export const {
  storeWallet,
  storeAddress,
  storeOGI,
  storeGEM,
  storeSign,
  storeStartTime,
  storeEndTime,
  storeMyWalletGems,
  storeMsg,
  storeMarketGems,
  storeMyGemSell,
  storeNftBought,
  storeBuyValue,
  storeSellValue,
  storeBNBSell,
  storeBUSDSell,
  storeBNBBuy,
  storeBUSDBuy,
  setLoadingForAgainFetch,
  storeStakingReward,
  storeUnStake
 
} = smartContractSlice.actions;
export const { storeInputValue, storeNewSpotPrice } = buyGemsSlice.actions;
export const { storeSaga } = sagaSlice.actions;
export default rootReducer;
// export default smartContractSlice.reducer;
