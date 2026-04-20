import React, { useCallback, useEffect, useState } from "react";
import { Typography, Row, Col, message, Flex, Button } from "antd";
import { useSearchParams } from "react-router-dom";
import CustomPackageSearch from "@/components/CustomPackageSearch";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import CustomPagination from "@/components/CustomPagination";
import NoDataLottie from "@/components/Feedback/NoDataLottie";
import { FilterNumberInput } from "@/components/FilterForms";
import { SEO } from "@/components/SEO";
import { useSearchHikeBlogLists } from "@/services/hikeServices/hikeServices";
import { HikeBlogListingResponse } from "@/types/hike";
import HikeCard from "./HikeCard";

const { Title, Text } = Typography;

type HikeFilters = {
  minAltitude: number | null;
  maxAltitude: number | null;
};

const defaultFilters: HikeFilters = {
  minAltitude: null,
  maxAltitude: null,
};

const ExploreHikes: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
  });
  const [listedHikes, setListedHikes] = useState<HikeBlogListingResponse | null>(
    null,
  );
  const [searchVal, setSearchVal] = useState("");
  const [draftFilters, setDraftFilters] = useState<HikeFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<HikeFilters>(defaultFilters);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");

  const { mutateAsync, isPending } = useSearchHikeBlogLists();

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
      const query: {
        q: string;
        page: number;
        pageSize: number;
        minAltitude?: number;
        maxAltitude?: number;
      } = {
        q: activeSearch,
        page: pagination.page,
        pageSize: pagination.pageSize,
      };

      if (appliedFilters.minAltitude !== null) {
        query.minAltitude = appliedFilters.minAltitude;
      }

      if (appliedFilters.maxAltitude !== null) {
        query.maxAltitude = appliedFilters.maxAltitude;
      }

      const response = await mutateAsync(query);
      if (response?.status === 200) {
        setListedHikes(response.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching hike blogs");
    }
  }, [appliedFilters, categoryQuery, mutateAsync, pagination, searchQuery]);

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
    setSearchParams(nextParams);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleApplyFilters = () => {
    if (isAltitudeRangeInvalid) {
      return;
    }

    setAppliedFilters({ ...draftFilters });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <>
      <SEO
        title="Explore Hikes"
        description="Find scenic day hikes across Nepal with distance, altitude, season, and route details."
        canonical={`${window.location.origin}/explore-hikes`}
      />

      <div
        style={{
          background:
            "radial-gradient(circle at top, rgba(66, 108, 77, 0.12), transparent 36%), linear-gradient(180deg, #fcfcf9 0%, #f3f6ef 100%)",
          padding: "20px 0 8px",
        }}
      >
        <Flex justify="center" align="center" style={{ marginBottom: "24px" }}>
          <div style={{ width: "min(100%, 680px)" }}>
            <CustomPackageSearch
              searchValue={searchVal}
              setSearchValue={setSearchVal}
              onSearchHandler={handleSearchSubmit}
              isLoading={isPending}
              placeholder="Search hikes by title, region, or keyword..."
            />
          </div>
        </Flex>

        <MiddleContentWrapper extraStyles={{ paddingTop: 0 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              <div
                style={{
                  position: "sticky",
                  top: "100px",
                  alignSelf: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "22px",
                    border: "1px solid rgba(19,32,34,0.08)",
                    borderRadius: "24px",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(247,249,242,0.96) 100%)",
                    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.06)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Title
                    level={4}
                    style={{ marginBottom: "8px", textAlign: "center" }}
                  >
                    Hike Filters
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    Narrow results by altitude range.
                  </Text>

                  <Flex vertical gap={16}>
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
                      style={{
                        height: "46px",
                        borderRadius: "14px",
                        fontWeight: 700,
                      }}
                    >
                      Apply Filters
                    </Button>
                  </Flex>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={18}>
              <div style={{ marginBottom: "24px" }}>
                <Title
                  level={1}
                  style={{
                    marginBottom: "10px",
                    fontWeight: 800,
                    color: "#173022",
                  }}
                >
                  Explore Hikes
                </Title>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#4b6356",
                    maxWidth: "60ch",
                    display: "block",
                  }}
                >
                  Discover short escapes, forest walks, ridge lines, and
                  viewpoint hikes with clean altitude-based filtering.
                </Text>
              </div>

              {!isPending && !listedHikes?.data?.length ? (
                <NoDataLottie title="No hikes found matching your criteria." />
              ) : (
                <>
                  <Row gutter={[24, 24]}>
                    {listedHikes?.data?.map((hike) => (
                      <Col
                        xs={24}
                        sm={12}
                        xl={8}
                        key={hike?._id || hike.slug}
                      >
                        <HikeCard
                          title={hike.title}
                          slug={hike.slug}
                          difficulty={hike.difficulty}
                          maxAltitudeMeter={hike.maxAltitudeMeter}
                          trailDistanceKm={hike.trailDistanceKm}
                          shortSlogan={hike.shortSlogan}
                          featuredImagePath={hike.featuredImage?.path}
                          recommendedSeasons={hike.recommendedSeasons}
                          hikeRegionName={hike.hikeRegion?.[0]?.name}
                          isPicnic={hike.isPicnic}
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
                        page: listedHikes?.pagination?.page || 1,
                        totalData: listedHikes?.pagination?.total || 0,
                        pageSize: listedHikes?.pagination?.pageSize || 9,
                      }}
                    />
                  </div>
                </>
              )}
            </Col>
          </Row>
        </MiddleContentWrapper>
      </div>
    </>
  );
};

export default ExploreHikes;
