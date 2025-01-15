import { createSlice } from "@reduxjs/toolkit";
let initialState = {
    currentUser: null,
    login: false ,
    chatId :null
}
export const Slice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        userState: (state, action) => {
            state.currentUser = action.payload;
        },
        userLogout: (state, action) => {
            state.currentUser = null;
            state.login = false;
            state.chatId=null;
        },
        userId:(state,action)=>{
           state.chatId =action.payload;
        },
        userLogin: (state, action) => {
            state.login = true
        }
    }

})
export const { userState, userLogout, userLogin,userId } = Slice.actions;
export default Slice.reducer