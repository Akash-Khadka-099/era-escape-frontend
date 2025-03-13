import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";

const AppProvider = ({ children }) => {
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

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppProvider;
