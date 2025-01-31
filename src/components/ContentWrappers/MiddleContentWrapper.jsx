import PropTypes from "prop-types";

const MiddleContentWrapper = ({ children, extraStyles, extraClassNames }) => {
  return (
    <div
      className={`mx-auto  p-3 py-5 ${extraClassNames}`}
      style={{
        width: "max(85%, 1400px)",
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
