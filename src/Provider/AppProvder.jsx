import { ConfigProvider } from "antd";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";

const AppProvder = ({ children }) => {
  return (
    <>
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
    </>
  );
};

AppProvder.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppProvder;
