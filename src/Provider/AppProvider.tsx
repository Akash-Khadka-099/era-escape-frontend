import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </>
  );
};

export default AppProvider;
