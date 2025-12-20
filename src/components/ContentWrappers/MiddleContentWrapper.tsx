import React from "react";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

interface MiddleContentWrapperProps {
  children?: React.ReactNode;
  extraStyles?: React.CSSProperties;
  extraClassNames?: string;
}

const MiddleContentWrapper: React.FC<MiddleContentWrapperProps> = ({
  children,
  extraStyles,
  extraClassNames,
}) => {
  const { xl } = useBreakpoint();
  return (
    <div
      className={`mx-auto p-3 py-5 ${extraClassNames || ""}`}
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

export default MiddleContentWrapper;
