import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name:"auth",

    initialState:{
        user:null
    },
    reducers:{
        //actions
        setAuthUser: (state,action) => {
            state.user = action.playoad;
        }
    }
})

export const {setAuthUser} = authSlice.actions;
export default authSlice.reducer;