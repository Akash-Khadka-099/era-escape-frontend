import SkeletonLoadingTable from "@/components/CustomDataTable/SkeletonLoadingTable";
import { Table } from "antd";
import PropTypes from "prop-types";

const CustomDataTable = ({
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

CustomDataTable.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  isLoading: PropTypes.bool,
  pagination: PropTypes.object,
};

export default CustomDataTable;
