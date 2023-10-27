import { configureStore } from "@reduxjs/toolkit";
import walletreducer from "./Components/reduxtoolkit/smartContract"
import buyGemreducer from "./Components/reduxtoolkit/smartContract"
import rootReducer from "./Components/reduxtoolkit/smartContract";


export const store = configureStore ({
    reducer: 
    { 
      // wallet: walletreducer, 
      // buyGem:buyGemreducer
      rootReducer:rootReducer
    },
  })