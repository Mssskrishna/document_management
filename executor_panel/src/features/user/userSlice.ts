import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  role: number | null;
  name: string;
  email: string;
  hasExecutorAccess: boolean;
}

interface AuthState {
  data: User;
  loggedIn: boolean;
}

const initialState: AuthState = {
  data: {
    role: null,
    name: "",
    email: "",
    hasExecutorAccess: false,
  },
  loggedIn: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.data = action.payload;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.loggedIn = action.payload;
    },
  },
});

export const { setUser, setLoggedIn } = userSlice.actions;
export default userSlice.reducer;
