import React from "react";

interface AdminWrappersProps {
  children?: React.ReactNode;
  extraStyles?: React.CSSProperties;
  extraClassNames?: string;
}

const AdminWrappers: React.FC<AdminWrappersProps> = ({
  children,
  extraStyles,
  extraClassNames,
}) => {
  return (
    <div
      className={`mx-auto my-3  ${extraClassNames || ""}`}
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

export default AdminWrappers;
