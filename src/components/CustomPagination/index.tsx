import React from "react";
import { Flex, Pagination, PaginationProps } from "antd";

interface PaginationDetail {
  page: number;
  pageSize: number;
  totalData: number;
  totalPages?: number;
}

interface CustomPaginationProps extends PaginationProps {
  paginationDetail: PaginationDetail;
  onChange?: (page: number, pageSize: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  paginationDetail, // page,  pageSize, totalData,totalPages,
  onChange,
  ...rest
}) => {
  //   const showTotal = (total, range) => {
  //     return `Showing ${range[0]} to ${range[1]} of ${total} items, Page ${paginationDetail?.page} of ${paginationDetail?.totalPages}`;
  //   };

  return (
    <Flex justify="center">
      <Pagination
        current={paginationDetail?.page}
        pageSize={paginationDetail?.pageSize}
        total={paginationDetail?.totalData}
        defaultCurrent={1}
        // showTotal={showTotal}
        onChange={onChange}
        {...rest}
      />
    </Flex>
  );
};

export default CustomPagination;
