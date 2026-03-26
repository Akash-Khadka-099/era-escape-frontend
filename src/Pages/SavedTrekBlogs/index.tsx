import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Row,
  Spin,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import useAuthStore from "@/store/authStore";
import useAuthModalStore from "@/store/authModalStore";
import {
  useDeleteSavedTrekBlog,
  useFetchSavedTrekBlogs,
} from "@/services/trekServices/trekServices";
import CustomPagination from "@/components/CustomPagination";
import { SEO } from "@/components/SEO";
import NoDataLottie from "@/components/Feedback/NoDataLottie";
import { routeLists } from "@/Routes/routeLists";

const { Title, Paragraph, Text } = Typography;

const SavedTrekBlogs: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: savedTrekBlogsResponse, isLoading } = useFetchSavedTrekBlogs(
    {
      page: pagination.page,
      pageSize: pagination.pageSize,
    },
    isAuthenticated,
  );
  const { mutateAsync: deleteSavedTrekBlog, isPending: isDeletingSavedTrekBlog } =
    useDeleteSavedTrekBlog();

  const savedTrekBlogs = savedTrekBlogsResponse?.data || [];

  const handleDeleteSavedTrekBlog = async (savedItemId: string) => {
    try {
      setDeletingId(savedItemId);
      const response = await deleteSavedTrekBlog(savedItemId);
      message.success(response?.data?.message || "Saved trek blog removed successfully");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Unable to remove saved trek blog";
      message.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <MiddleContentWrapper>
        <Flex
          vertical
          align="center"
          justify="center"
          gap={16}
          style={{ minHeight: "60vh" }}
        >
          <Title level={3} style={{ marginBottom: 0 }}>
            Login Required
          </Title>
          <Paragraph style={{ margin: 0, maxWidth: 500, textAlign: "center" }}>
            Please login to view your saved trek blogs.
          </Paragraph>
          <Button type="primary" onClick={openAuthModal}>
            Open Login
          </Button>
        </Flex>
      </MiddleContentWrapper>
    );
  }

  return (
    <>
      <SEO
        title="Saved Trek Blogs"
        description="View all trek blogs you have saved for later."
        canonical={`${window.location.origin}/saved-trek-blogs`}
      />
      <MiddleContentWrapper>
        <div style={{ marginBottom: "1.5rem" }}>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Saved Trek Blogs
          </Title>
          <Text type="secondary">
            Your personal list of trek blogs saved for later.
          </Text>
        </div>

        {isLoading ? (
          <Flex justify="center" align="center" style={{ minHeight: "40vh" }}>
            <Spin size="large" />
          </Flex>
        ) : !savedTrekBlogs?.length ? (
          <NoDataLottie
            title="No saved trek blogs yet"
            description="Start adding your favorite trails and they will appear here."
            actionLabel="Add Saved Blogs"
            onAction={() => navigate(routeLists.trekTrails)}
          />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {savedTrekBlogs.map((item: any) => {
                const savedItemId = item?._id || item?.id;
                const trekBlog = item?.trekBlogId;
                const imagePath = trekBlog?.featuredImage?.path;

                return (
                  <Col xs={24} md={12} xl={8} key={savedItemId}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={trekBlog?.title || "Saved Trek Blog"}
                          src={
                            imagePath
                              ? `${import.meta.env.VITE_API_URL}/${imagePath}`
                              : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
                          }
                          style={{ height: 220, objectFit: "cover" }}
                        />
                      }
                      styles={{
                        body: {
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        },
                      }}
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        {trekBlog?.title}
                      </Title>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ marginBottom: 0 }}
                      >
                        {trekBlog?.shortNotes || "No short description available."}
                      </Paragraph>
                      <Flex gap={8} style={{ marginTop: "auto" }}>
                        <Button
                          type="primary"
                          onClick={() =>
                            navigate(`/trek-trails/detail/${trekBlog?.slug}`)
                          }
                        >
                          View Details
                        </Button>
                        <Button
                          danger
                          loading={
                            isDeletingSavedTrekBlog && deletingId === savedItemId
                          }
                          onClick={() => handleDeleteSavedTrekBlog(savedItemId)}
                        >
                          Remove
                        </Button>
                      </Flex>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CustomPagination
                onChange={(value: number) =>
                  setPagination((oldState) => ({
                    ...oldState,
                    page: value,
                  }))
                }
                paginationDetail={{
                  page: savedTrekBlogsResponse?.pagination?.page || 1,
                  totalData: savedTrekBlogsResponse?.pagination?.total || 0,
                  pageSize:
                    savedTrekBlogsResponse?.pagination?.pageSize ||
                    pagination.pageSize,
                }}
              />
            </div>
          </>
        )}
      </MiddleContentWrapper>
    </>
  );
};

export default SavedTrekBlogs;
