import React from "react";
import { Table, Skeleton, Flex } from "antd";

const SkeletonLoadingTable: React.FC = () => {
  const columns: any[] = Array.from({ length: 9 }, (_, index) => ({
    title: <Skeleton.Input active size="small" style={{ width: "80%" }} />,
    dataIndex: `col${index + 1}`,
    key: `col${index + 1}`,
    render: () => (
      <Skeleton active paragraph={false} title={{ width: "80%" }} />
    ),
  }));

  columns.push({
    title: <Skeleton.Input active size="small" style={{ width: "80%" }} />,
    dataIndex: "actions",
    key: "actions",
    render: () => (
      <Flex gap={16} justify="center">
        <Skeleton.Avatar active size="default" shape="circle" />
        <Skeleton.Avatar active size="default" shape="circle" />
      </Flex>
    ),
  });

  const data = Array.from({ length: 10 }, (_, index) => ({
    key: index,
    ...columns.reduce((acc, col) => {
      acc[col.dataIndex] = null;
      return acc;
    }, {}),
  }));

  return <Table size="small" columns={columns} dataSource={data} pagination={false} />;
};

export default SkeletonLoadingTable;
