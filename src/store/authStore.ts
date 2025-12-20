import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface DecodedUser {
  [key: string]: any; // You can make this more specific based on your JWT payload
}

interface AuthState {
  accessToken: string | null;
  user: DecodedUser | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null, // Store decoded user details
  isAuthenticated: false,

  setAccessToken: (token: string) => {
    try {
      const decodedUser = jwtDecode<DecodedUser>(token);
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
