import Posts from '@/components/Posts';
import {createSlice} from '@reduxjs/toolkit';

const postSlice = createSlice ({
    name : 'post',
    initialState : {
        Posts: [],
        selectedPost : null
    }, 
    reducers : {
        setPosts : (state, action) => {
            state.posts = action.payload
        }, 
        setSeelectedPost : (state,action) => {
            state.selectedPost = action.payload;
        }
    }
});

export const {setPosts} = postSlice.actions;
export default postSlice.reducer;