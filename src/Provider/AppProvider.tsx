import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_TAP_LOGIN_CLIENT_ID}
        >
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: "#46612e",
                  algorithm: true,
                },
              },
            }}
          >
            <BrowserRouter>{children}</BrowserRouter>
          </ConfigProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </>
  );
};

export default AppProvider;
