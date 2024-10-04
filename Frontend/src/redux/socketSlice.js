import { createSlice} from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";


const socketSlice = createSlice({
    name: 'socketio',
    initialState : {
        Socket: null
    },
    reducers : {
        setSocket:(state,action) => {
            state.Socket  = action.payload
        }
    }
});

export const { setSocket} = socketSlice.actions;

export default socketSlice.reducer;