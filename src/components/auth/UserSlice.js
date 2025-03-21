import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userEmail: null,
  userLoginLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload
    },
    setUserLoginLoading: (state, action) => {
      state.userLoginLoading = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserEmail, setUserLoginLoading } = userSlice.actions

export default userSlice.reducer