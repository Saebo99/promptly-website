import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userSlice } from "./slices/userSlice";
import { projectSlice } from "./slices/projectSlice";
import { modelSlice } from "./slices/modelSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = { key: "root", storage };

const rootReducer = combineReducers({
  user: userSlice.reducer,
  project: projectSlice.reducer,
  model: modelSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
