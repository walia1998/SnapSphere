import { createSlice} from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";


const chatSlice = createSlice({
    name: 'chat',
    initialState : {
        onlineUsers: []
    },
    reducers : {
        setOnlineUsers:(state,action) => {
            state.onlineUsers  = action.payload
        }
    }
});

export const { setOnlineUsers} = chatSlice.actions;

export default chatSlice.reducer;