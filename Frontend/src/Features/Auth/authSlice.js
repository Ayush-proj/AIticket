import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginSuccess:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.error=null;
            state.loading=false;


        },

        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            state.loading = false;
        }
    }
});
export const {loginSuccess,logoutSuccess}=authSlice.actions;

export default authSlice.reducer;