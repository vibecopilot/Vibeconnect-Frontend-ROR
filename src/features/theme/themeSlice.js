// import { createSlice } from "@reduxjs/toolkit";

// export const themeSlice = createSlice({
//   name: "theme",
//   initialState: {
//     color: "radial-gradient( circle 897px at 9% 80.3%,  rgba(55,60,245,1) 0%, rgba(234,161,15,0.90) 100.2% )",
//     // color: "black",
//   },
//   reducers: {
//     setColor: (state, action) => {
//       state.color = action.payload;
//     },
//   },
// });

// // export const { setColor } = themeSlice.actions;
// // Inside your themeSlice.js or wherever setColor is dispatched
// export const setColor = (color) => (dispatch) => {
//   localStorage.setItem("themeColor", color); // Save to localStorage
//   dispatch(themeSlice.actions.setColor(color));
// };



// export default themeSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

// 1. Load the theme color from localStorage if it exists
const storedColor = localStorage.getItem("themeColor");

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    color: storedColor || "radial-gradient( circle 897px at 9% 80.3%,  rgba(55,60,245,1) 0%, rgba(234,161,15,0.90) 100.2% )",
  },
  reducers: {
    setColor: (state, action) => {
      state.color = action.payload;

      // 2. Save the selected color to localStorage so it persists
      localStorage.setItem("themeColor", action.payload);
    },
  },
});

export const { setColor } = themeSlice.actions;

export default themeSlice.reducer;
