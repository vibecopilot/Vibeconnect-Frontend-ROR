import { createSlice } from "@reduxjs/toolkit";
const wave = "/wave.png";
export const backgroundSlice = createSlice({
  name: "background",
  initialState: {
    background: wave,
  },
  reducers:{
    setBackground:(state, action) =>{
        state.background= action.payload
    }
  }
});

export const {setBackground} = backgroundSlice.actions
export default backgroundSlice.reducer