import { combineReducers } from "@reduxjs/toolkit";
import EventsSlice from "./slices/EventsSlice";

export const rootReducer = combineReducers({
    EventsSlice: EventsSlice,
})

export type RootState = ReturnType<typeof rootReducer>
