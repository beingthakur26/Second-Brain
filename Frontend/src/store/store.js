import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import itemsReducer from "./slices/itemsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        items: itemsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});