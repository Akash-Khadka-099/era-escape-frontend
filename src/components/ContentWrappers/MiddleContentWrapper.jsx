import PropTypes from "prop-types";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

const MiddleContentWrapper = ({ children, extraStyles, extraClassNames }) => {
  const { xl } = useBreakpoint();
  return (
    <div
      className={`mx-auto p-3 py-5 ${extraClassNames}`}
      style={{
        width: xl ? "max(85%, 1400px)" : "",
        overflow: "hidden",
        ...extraStyles,
      }}
    >
      {children}
    </div>
  );
};

MiddleContentWrapper.propTypes = {
  children: PropTypes.node,
  extraStyles: PropTypes.object,
  extraClassNames: PropTypes.string,
};

export default MiddleContentWrapper;
