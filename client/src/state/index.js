import { createSlice } from "@reduxjs/toolkit";

const initialState={
    id:"",
    accessToken:null
}

export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setLogin:(state,action)=>{
            state.id=action.payload.id
            state.accessToken=action.payload.accessToken
        },
        setLogout:(state)=>{
            state.id=""
            state.accessToken=""
        },
    }
})

export const {setLogin,setLogout}=authSlice.actions
export default authSlice.reducer