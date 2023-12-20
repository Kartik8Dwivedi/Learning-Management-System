import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  role: string;
  data: Record<string, unknown>; // Adjust the type based on the actual structure of your data
}

const initialState: AuthState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  role: localStorage.getItem("role") || "",
  data: JSON.parse(localStorage.getItem("data") || "{}"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

// Export actions if needed
export const {
  /* Action creators go here */
} = authSlice.actions;

export default authSlice.reducer;
