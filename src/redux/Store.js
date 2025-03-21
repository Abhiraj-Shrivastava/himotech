import { configureStore } from '@reduxjs/toolkit'
import UserReducer from '../components/auth/UserSlice'
import ProfileReducer from '../components/dashboard/dashbordlayout/ProfileDetailsSlice'

export const store = configureStore({
  reducer: {
    user: UserReducer,
    profile: ProfileReducer
  },
})