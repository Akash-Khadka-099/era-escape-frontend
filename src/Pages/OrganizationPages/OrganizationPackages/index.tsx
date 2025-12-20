import React from "react";
import CustomCard from "@/components/Cards/CustomCard";
import AdminWrappers from "@/components/ContentWrappers/AdminWrappers";
import CustomDataTable from "@/components/CustomDataTable";
import {
  useFetchOrganizationPackage,
  useUpdatepackageActiveStatus,
} from "@/services/packageService";
import useAuthStore from "@/store/authStore";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Image,
  message,
  Popconfirm,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const OrganizationPackages: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data, isLoading } = useFetchOrganizationPackage({
    organizationId: user?.organizationId,
  });
  const { mutateAsync } = useUpdatepackageActiveStatus();

  const handleChangePackageActiveStatus = async (id: string, activeStatus: boolean) => {
    try {
      const statusResponse = await mutateAsync({
        id: id,
        payloads: {
          isActive: activeStatus,
        },
      });

      if (statusResponse?.status == 200) {
        message.success("Package  status changed successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: any = [
    {
      title: "SN ",
      align: "center",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Package Title",
      align: "center",
      dataIndex: "title",
    },
    {
      title: "Status",
      align: "center",
      render: (item: any) =>
        item?.isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Image",
      align: "center",
      render: (_: unknown, item: any) => {
        return item?.profileImage ? (
          <Image
            width={50}
            height={50}
            src={`${import.meta.env.VITE_API_URL}/${item?.profileImage?.path}`}
          />
        ) : (
          "No Image"
        );
      },
    },
    {
      title: "Insurance Status",
      align: "center",
      render: (item: any) =>
        item?.insuranceRequired ? (
          <Tag color="blue">Required</Tag>
        ) : (
          <Tag color="green">Not Required</Tag>
        ),
    },
    {
      title: "Created Date ",
      align: "center",
      render: (item: any) => moment(item?.createdAt)?.format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      render: (_: unknown, item: any) => (
        <Flex gap={8}>
          <Tooltip color="green" title={"Edit"}>
            <Button
              shape="circle"
              icon={<EditOutlined style={{ color: "green" }} />}
              onClick={() =>
                navigate(`/organization-package/edit/${item?.slug}`)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete Confirmation"
            description="Are you sure to delete this destination?"
            onConfirm={() =>
              message.success("Delete functionality in progress")
            }
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip color="red" title={"Delete"}>
              <Button
                shape="circle"
                icon={<DeleteOutlined style={{ color: "red" }} />}
              />
            </Tooltip>{" "}
          </Popconfirm>
          <Tooltip
            title={`${item?.isActive ? "Deactive" : "Activate"} package status`}
          >
            <Switch
              value={item?.isActive}
              onChange={(e) => {
                handleChangePackageActiveStatus(item?.id, e);
              }}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <AdminWrappers>
        <CustomCard
          title={"Organization Pakackages"}
          extra={
            <Button
              type="primary"
              onClick={() => navigate("/organization-package/add")}
            >
              {" "}
              + Add Packages
            </Button>
          }
        >
          <CustomDataTable
            columns={columns}
            dataSource={data?.data || []}
            isLoading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </CustomCard>
      </AdminWrappers>
    </>
  );
};

export default OrganizationPackages;
