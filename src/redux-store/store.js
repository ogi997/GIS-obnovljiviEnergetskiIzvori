import { configureStore } from "@reduxjs/toolkit";
import temporaryLayersReducer from "./testslice";
import userReducer from "./userSlice";
import modelsReducer from "./modelsSlice";
import utilsReducer from "./utils";

export const store = configureStore({
  reducer: {
    temporaryLayers: temporaryLayersReducer,
    users: userReducer,
    models: modelsReducer,
    utils: utilsReducer
  }
});
