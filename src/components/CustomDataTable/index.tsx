import React from "react";
import SkeletonLoadingTable from "@/components/CustomDataTable/SkeletonLoadingTable";
import { Table, TableProps } from "antd";

interface CustomDataTableProps extends TableProps<any> {
  isLoading?: boolean;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  columns = [],
  dataSource = [],
  isLoading,
  pagination,
  ...props
}) => {
  if (isLoading) {
    return (
      <div className="my-2">
        {" "}
        <SkeletonLoadingTable />
      </div>
    );
  }
  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        {...props}
      />
    </>
  );
};

export default CustomDataTable;
