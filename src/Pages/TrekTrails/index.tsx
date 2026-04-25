import React, { useCallback, useEffect, useState } from "react";
import { Typography, Row, Col, message, Flex, Button } from "antd";
import CustomPackageSearch from "@/components/CustomPackageSearch";
import TrekCard from "./TrekCard";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import { useSearchTrekBlogLists } from "@/services/trekServices/trekServices";
import { useSearchParams } from "react-router-dom";
import CustomPagination from "@/components/CustomPagination";
import { SEO } from "@/components/SEO";
import NoDataLottie from "@/components/Feedback/NoDataLottie";
import { FilterNumberInput, FilterSelectField } from "@/components/FilterForms";

const { Title, Text } = Typography;

const difficultyOptions = [
  { label: "All", value: "All" },
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

type TrailFilters = {
  difficulty: string;
  minAltitude: number | null;
  maxAltitude: number | null;
};

const defaultFilters: TrailFilters = {
  difficulty: "All",
  minAltitude: null,
  maxAltitude: null,
};

const PAGE_SIZE = 6;

const ExploreTrails: React.FC = () => {
  const [listedTrails, setListedTrails] = useState<any>({});
  const [searchVal, setSearchVal] = useState("");

  const [draftFilters, setDraftFilters] = useState<TrailFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<TrailFilters>(defaultFilters);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const { mutateAsync, isPending } = useSearchTrekBlogLists();
  const isAltitudeRangeInvalid =
    draftFilters.minAltitude !== null &&
    draftFilters.maxAltitude !== null &&
    draftFilters.minAltitude > draftFilters.maxAltitude;
  const minAltitudeError = isAltitudeRangeInvalid
    ? "Min altitude must be less than or equal to max altitude."
    : undefined;
  const maxAltitudeError = isAltitudeRangeInvalid
    ? "Max altitude must be greater than or equal to min altitude."
    : undefined;

  const fetchData = useCallback(async () => {
    try {
      const activeSearch = searchQuery || categoryQuery || "";
      const query: any = {
        q: activeSearch,
        page: currentPage,
        pageSize: PAGE_SIZE,
      };

      if (appliedFilters.difficulty !== "All") {
        query.difficulty = appliedFilters.difficulty;
      }
      if (appliedFilters.minAltitude !== null) {
        query.minAltitude = appliedFilters.minAltitude;
      }
      if (appliedFilters.maxAltitude !== null) {
        query.maxAltitude = appliedFilters.maxAltitude;
      }

      const response = await mutateAsync(query);
      if (response?.status === 200) {
        setListedTrails(response?.data || []);
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching trek trails");
    }
  }, [
    currentPage,
    searchQuery,
    categoryQuery,
    appliedFilters,
    mutateAsync,
  ]);

  useEffect(() => {
    const activeSearch = searchQuery || categoryQuery || "";
    setSearchVal(activeSearch);
    fetchData();
  }, [fetchData, searchQuery, categoryQuery]);

  const handleSearchSubmit = (value: string) => {
    const trimmedValue = value.trim();
    const nextParams = new URLSearchParams(searchParams);

    if (trimmedValue) {
      nextParams.set("search", trimmedValue);
    } else {
      nextParams.delete("search");
    }

    nextParams.delete("category");
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handleApplyFilters = () => {
    if (isAltitudeRangeInvalid) {
      return;
    }

    setAppliedFilters({ ...draftFilters });
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (page > 1) {
      nextParams.set("page", String(page));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };

  return (
    <>
      <SEO
        title="Explore Trekking Trails"
        description="Discover the world's most breathtaking trekking routes and hidden gems. From Annapurna to Everest, find your next adventure."
        canonical={`${window.location.origin}/trek-trails`}
      />
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
          <Col xs={0} lg={6}>
            <div
              style={{
                position: "sticky",
                top: "100px",
                alignSelf: "flex-start",
              }}
            >
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
                  <FilterSelectField
                    label="Difficulty"
                    value={draftFilters.difficulty}
                    options={difficultyOptions}
                    debounceMs={0}
                    onChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        difficulty: value,
                      }))
                    }
                  />

                  <FilterNumberInput
                    label="Min Altitude"
                    value={draftFilters.minAltitude}
                    min={0}
                    debounceMs={0}
                    errorMessage={minAltitudeError}
                    placeholder="Minimum altitude"
                    onChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        minAltitude: value,
                      }))
                    }
                  />

                  <FilterNumberInput
                    label="Max Altitude"
                    value={draftFilters.maxAltitude}
                    min={0}
                    debounceMs={0}
                    errorMessage={maxAltitudeError}
                    placeholder="Maximum altitude"
                    onChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        maxAltitude: value,
                      }))
                    }
                  />

                  <Button
                    type="primary"
                    block
                    loading={isPending}
                    disabled={isAltitudeRangeInvalid}
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                </Flex>
              </div>
            </div>
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
              <NoDataLottie title="No trails found matching your criteria." />
            ) : (
              <>
                <Row gutter={[24, 24]}>
                  {listedTrails?.data?.map((trail: any) => (
                    <Col
                      xs={24}
                      sm={12}
                      lg={12}
                      xl={8}
                      key={trail?._id || trail?.id}
                    >
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
                    onChange={handlePageChange}
                    paginationDetail={{
                      page: listedTrails?.pagination?.page || 1,
                      totalData: listedTrails?.pagination?.total || 0,
                      pageSize: PAGE_SIZE,
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
