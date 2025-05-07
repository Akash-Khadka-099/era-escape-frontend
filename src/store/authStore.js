import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  user: null, // Store decoded user details
  isAuthenticated: false,

  setAccessToken: (token) => {
    try {
      const decodedUser = jwtDecode(token);
      set({
        accessToken: token,
        user: decodedUser,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Invalid token", error);
      set({ accessToken: null, user: null, isAuthenticated: false });
    }
  },

  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false }),
}));

export default useAuthStore;
