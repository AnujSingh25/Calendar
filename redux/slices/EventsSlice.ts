import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../reducer';

export interface Events {
    Events: any,
}

const initialState: Events = {
    Events: null
}

export const EventsSlice = createSlice({
    name: 'EventsSlice',
    initialState,
    reducers: {
        UpdateEvents: (state, action) => {
            state.Events = action.payload
        }
    }
})

export const { UpdateEvents } = EventsSlice.actions;
export const EventsSliceSelector = (state: RootState) => state.EventsSlice;
export default EventsSlice.reducer;