import { Route, Routes } from "react-router-dom";
import AppProvider from "@/Provider/AppProvider";
import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

import { userRoutes } from "@/Routes/userRoutes";
import UserLayout from "@/layout/UserLayout";
import ResetPasswordForm from "@/Pages/LoginRegister/ResetPassword";
// import { GlobalSpinner } from "@/components/Feedback";

const App = () => {
  const { setAccessToken, user } = useAuthStore();
  // const [isLoading, setIsLoading] = useState(true);

  console.log("user details", user);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          null,

          { withCredentials: true }
        );
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Unable to refresh token:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setAccessToken]);

  // if (isLoading) {
  //   return <GlobalSpinner />;
  // }

  return (
    <>
      <AppProvider>
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
