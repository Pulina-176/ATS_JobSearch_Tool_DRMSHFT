import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import inputReducer from "./slices/inputSlice.js"
import atsDataReducer from "./slices/atsDataSlice.js"

const rootReducer = combineReducers({input: inputReducer, atsData: atsDataReducer})

const persistConfig = {
    key: "root",
    version: 1,
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })  
});

export const persistor = persistStore(store);