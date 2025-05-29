import PropTypes from "prop-types";

const AdminWrappers = ({ children, extraStyles, extraClassNames }) => {
  return (
    <div
      className={`mx-auto my-3  ${extraClassNames}`}
      style={{
        width: "max(95%, 1400px)",
        overflow: "hidden",
        ...extraStyles,
      }}
    >
      {children}
    </div>
  );
};

AdminWrappers.propTypes = {
  children: PropTypes.node,
  extraStyles: PropTypes.object,
  extraClassNames: PropTypes.string,
};

export default AdminWrappers;
