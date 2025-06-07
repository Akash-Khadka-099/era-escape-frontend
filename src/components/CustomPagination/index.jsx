import { Flex, Pagination } from "antd";
import PropTypes from "prop-types";

const CustomPagination = ({
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

CustomPagination.propTypes = {
  //   page: PropTypes.number.isRequired,
  //   pageSize: PropTypes.number.isRequired,
  //   totalData: PropTypes.number.isRequired,
  //   totalPages: PropTypes.number.isRequired,
  paginationDetail: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export default CustomPagination;
