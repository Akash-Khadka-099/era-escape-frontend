import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Select,
  Row,
  Col,
  Space,
  message,
  Flex,
  Affix,
} from "antd";
import CustomPackageSearch from "@/components/CustomPackageSearch";
import TrekCard from "./TrekCard";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import { useSearchTrekBlogLists } from "@/services/trekServices/trekServices";
import { useSearchParams } from "react-router-dom";
import CustomPagination from "@/components/CustomPagination";
import Lottie from "react-lottie";
import NoDataFound from "@/assets/JsonAnimation/noDataFound.json";

const { Title, Text } = Typography;
const { Option } = Select;

const ExploreTrails: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
  });
  const [listedTrails, setListedTrails] = useState<any>({});
  const [searchVal, setSearchVal] = useState("");

  // Filter states
  const [regionFilter, setRegionFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [durationFilter, setDurationFilter] = useState("All");
  const [elevationFilter, setElevationFilter] = useState("All");

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");

  const { mutateAsync, isPending } = useSearchTrekBlogLists();

  const fetchData = useCallback(async () => {
    try {
      const activeSearch = searchQuery || categoryQuery || "";
      const query: any = {
        q: activeSearch,
        page: pagination.page,
        limit: pagination.pageSize,
      };

      if (regionFilter !== "All") query.region = regionFilter;
      if (difficultyFilter !== "All") query.difficulty = difficultyFilter;
      if (durationFilter !== "All") query.duration = durationFilter;
      if (elevationFilter !== "All") query.elevation = elevationFilter;

      const response = await mutateAsync(query);
      if (response?.status === 200) {
        setListedTrails(response?.data || []);
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching trek trails");
    }
  }, [
    pagination,
    searchQuery,
    categoryQuery,
    regionFilter,
    difficultyFilter,
    durationFilter,
    elevationFilter,
    mutateAsync,
  ]);

  useEffect(() => {
    const activeSearch = searchQuery || categoryQuery;
    if (activeSearch) {
      setSearchVal(activeSearch);
    }
    fetchData();
  }, [fetchData, searchQuery, categoryQuery]);

  const handleSearchSubmit = (value: string) => {
    setSearchParams({ search: value });
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on search
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoDataFound,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <Flex justify="center" align="center" style={{ marginBottom: "20px" }}>
        <div style={{ width: "clamp(400px, 600px, 80%)" }}>
          <CustomPackageSearch
            searchValue={searchVal}
            setSearchValue={setSearchVal}
            onSearchHandler={handleSearchSubmit}
            isLoading={isPending}
            placeholder="Search by destination or trail..."
          />
        </div>
      </Flex>

      <MiddleContentWrapper>
        <Row gutter={24}>
          {/* Sidebar Filters */}
          <Col xs={24} lg={6}>
            <Affix offsetTop={100}>
              <div
                style={{
                  padding: "20px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  height: "fit-content",
                  maxHeight: "calc(100vh - 120px)",
                  overflowY: "auto",
                }}
              >
                <Title
                  level={4}
                  style={{ marginBottom: "20px", textAlign: "center" }}
                >
                  Filters
                </Title>
                <Flex vertical gap={16}>
                  <div>
                    <Text strong>Region</Text>
                    <Select
                      defaultValue="All"
                      style={{ width: "100%", marginTop: "8px" }}
                      className="custom-filter-select"
                      onChange={(val) => {
                        setRegionFilter(val);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                    >
                      <Option value="All">All</Option>
                      <Option value="Annapurna">Annapurna</Option>
                      <Option value="Everest">Everest</Option>
                    </Select>
                  </div>

                  <div>
                    <Text strong>Difficulty</Text>
                    <Select
                      defaultValue="All"
                      style={{ width: "100%", marginTop: "8px" }}
                      className="custom-filter-select"
                      onChange={(val) => {
                        setDifficultyFilter(val);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                    >
                      <Option value="All">All</Option>
                      <Option value="Easy">Easy</Option>
                      <Option value="Moderate">Moderate</Option>
                      <Option value="Hard">Hard</Option>
                    </Select>
                  </div>

                  <div>
                    <Text strong>Duration</Text>
                    <Select
                      defaultValue="All"
                      style={{ width: "100%", marginTop: "8px" }}
                      className="custom-filter-select"
                      onChange={(val) => {
                        setDurationFilter(val);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                    >
                      <Option value="All">All</Option>
                      <Option value="Short">Short</Option>
                      <Option value="Long">Long</Option>
                    </Select>
                  </div>

                  <div>
                    <Text strong>Elevation</Text>
                    <Select
                      defaultValue="All"
                      style={{ width: "100%", marginTop: "8px" }}
                      className="custom-filter-select"
                      onChange={(val) => {
                        setElevationFilter(val);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                    >
                      <Option value="All">All</Option>
                      <Option value="High">High</Option>
                      <Option value="Low">Low</Option>
                    </Select>
                  </div>

                  {/* Optional: Add a reset button if needed, but not strictly requested */}
                </Flex>
              </div>
            </Affix>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={18}>
            <div style={{ marginBottom: "20px" }}>
              <Title
                level={1}
                style={{ marginBottom: "8px", fontWeight: "bold" }}
              >
                Explore Trails
              </Title>
              <Text
                type="secondary"
                style={{ fontSize: "16px", color: "#52c41a" }}
              >
                Discover the world's most breathtaking trekking routes and
                hidden gems.
              </Text>
            </div>

            {/* Trails Grid */}
            {!isPending && !listedTrails?.data?.length ? (
              <Flex
                vertical
                align="center"
                className="mt-4"
                justify="center"
                style={{ width: "100%", minHeight: "300px" }}
              >
                <Lottie options={defaultOptions} height={300} width={300} />
                <Title level={5} type="secondary">
                  No trails found matching your criteria.
                </Title>
              </Flex>
            ) : (
              <>
                <Row gutter={[24, 24]}>
                  {listedTrails?.data?.map((trail: any) => (
                    <Col xs={24} sm={12} lg={8} key={trail?._id || trail?.id}>
                      <TrekCard
                        id={trail?._id || trail?.id}
                        title={trail?.title}
                        days={Number(
                          trail?.averageDurationDays || trail?.duration || 0,
                        )}
                        elevation={`${
                          trail?.maxAltitudeMeter || trail?.elevation || "N/A"
                        }`}
                        description={trail?.shortNotes || trail?.overview || ""}
                        images={[trail?.featuredImage?.path]}
                        trekSlug={trail?.slug}
                      />
                    </Col>
                  ))}
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
                      page: listedTrails?.pagination?.page || 1,
                      totalData: listedTrails?.pagination?.total || 0,
                      pageSize: listedTrails?.pagination?.limit || 9,
                    }}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </MiddleContentWrapper>

      <style>{`
        .custom-filter-select .ant-select-selector {
          background-color: #f8f9fa !important;
          border-radius: 6px !important;
          padding: 0 12px !important;
        }
      `}</style>
    </>
  );
};

export default ExploreTrails;
