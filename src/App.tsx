import { Route, Routes } from "react-router-dom";
import AppProvider from "@/Provider/AppProvider";
import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

import { userRoutes } from "@/Routes/userRoutes";
import UserLayout from "@/layout/UserLayout";
import ResetPasswordForm from "@/Pages/LoginRegister/ResetPassword";

const GoogleOneTapHandler = () => {
  const { isAuthenticated } = useAuthStore();
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();

  useGoogleOneTapLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    disabled: isAuthenticated,
  });

  return null;
};

const App = () => {
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          null,
          { withCredentials: true },
        );
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Unable to refresh token:", error);
      }
    };

    initializeAuth();
  }, [setAccessToken]);

  return (
    <>
      <AppProvider>
        <GoogleOneTapHandler />
        <Routes>
          {userRoutes.map((item, index) => (
            <Route
              key={index}
              path={item?.path}
              element={<UserLayout>{item?.element}</UserLayout>}
            />
          ))}
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Routes>
      </AppProvider>
    </>
  );
};

export default App;
