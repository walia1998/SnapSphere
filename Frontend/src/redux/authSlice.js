import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name:"auth",

    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile : null,
    },
    reducers:{
        //actions
        setAuthUser: (state,action) => {
            state.user = action.playoad;
        },
        setSuggestedUsers : (state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state,action ) => {
            state.userProfile = action.payload
        }
    }
})

export const {setAuthUser, setSuggestedUsers, setUserProfile} = authSlice.actions;
export default authSlice.reducer;