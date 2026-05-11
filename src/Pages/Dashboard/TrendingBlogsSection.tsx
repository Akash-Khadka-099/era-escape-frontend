import React, { useMemo, useRef, useState } from "react";
import { Carousel, Grid, Segmented } from "antd";
import {
  ArrowRightOutlined,
  FireOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  type TrendingTrekBlog,
  useFetchTrendingTrekBlogsByVisits,
} from "@/services/userHomepageServices/homepageServices";
import { routeLists } from "@/Routes/routeLists";

const { useBreakpoint } = Grid;
const BASE_API_URL = import.meta.env.VITE_API_URL;

const PERIOD_DAYS_BY_MONTH: Record<number, number> = {
  1: 30,
  2: 60,
  3: 90,
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1400&auto=format&fit=crop";

const resolveImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_API_URL}${normalizedPath}`;
};

const buildSlogan = (blog: TrendingTrekBlog) => {
  if (blog?.trekBlog?.difficulty && blog?.trekBlog?.averageDurationDays) {
    return `${blog.trekBlog.difficulty} • ${blog.trekBlog.averageDurationDays} day route`;
  }

  return `${blog.uniqueVisitorCount} explorers this month`;
};

const chunkItems = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";

const TrendingBlogsSection: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const carouselRef = useRef<React.ElementRef<typeof Carousel>>(null);
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const periodDays = PERIOD_DAYS_BY_MONTH[selectedMonth] || 30;
  const { data: trendingResponse, isLoading } = useFetchTrendingTrekBlogsByVisits(
    {
      periodDays,
      limit: 8,
    },
  );

  const cardsPerSlide = useMemo(() => {
    if (screens.xl) return 3;
    if (screens.md) return 2;
    return 1;
  }, [screens]);

  const blogs = trendingResponse?.data || [];
  const slides = useMemo(
    () => chunkItems(blogs, cardsPerSlide),
    [blogs, cardsPerSlide],
  );

  return (
    <section className="trending-blogs-home-section">
      <MiddleContentWrapper extraClassNames="trending-blogs-home-container">
        <div className="trending-blogs-home-header">
          <div>
            <span className="trending-blogs-home-kicker">Pulse of the Trail</span>
            <h2>Trending Blogs Travelers Are Reading</h2>
            <p>
              Freshly ranked by recent read activity. Discover stories that
              hikers are opening the most right now.
            </p>
          </div>
          <div className="trending-blogs-home-controls">
            <Segmented
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(Number(value))}
              options={[
                { label: "1 Month", value: 1 },
                { label: "2 Months", value: 2 },
                { label: "3 Months", value: 3 },
              ]}
            />
            <button
              className="trending-blogs-home-explore"
              type="button"
              onClick={() => navigate(routeLists.trekTrails)}
            >
              Explore all <ArrowRightOutlined />
            </button>
          </div>
        </div>

        <div className="trending-blogs-home-carousel">
          {isLoading ? (
            <div className="trending-blogs-home-empty">Loading trending blogs...</div>
          ) : slides.length ? (
            <>
              <Carousel ref={carouselRef} dots={false} draggable adaptiveHeight>
                {slides.map((slideBlogs, slideIndex) => (
                  <div key={`slide-${slideIndex}`}>
                    <div className="trending-blogs-home-grid">
                      {slideBlogs.map((blog) => (
                        <article
                          className="trending-blogs-home-card"
                          key={blog.trekBlogId}
                          onClick={() =>
                            navigate(`/trek-trails/detail/${blog.trekBlog.slug}`)
                          }
                        >
                          <img
                            className="trending-blogs-home-card-image"
                            src={resolveImageUrl(blog?.featuredImage?.path)}
                            alt={blog?.trekBlog?.title}
                          />
                          <div className="trending-blogs-home-card-overlay" />
                          <div className="trending-blogs-home-card-content">
                            <div className="trending-blogs-home-chip">
                              <FireOutlined />
                              <span>{blog.totalVisits} total reads</span>
                            </div>
                            <p className="trending-blogs-home-card-slogan">
                              {buildSlogan(blog)}
                            </p>
                            <h3>{blog?.trekBlog?.title}</h3>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </Carousel>

              {slides.length > 1 ? (
                <div className="trending-blogs-home-nav">
                  <button type="button" onClick={() => carouselRef.current?.prev()}>
                    <LeftOutlined />
                  </button>
                  <button type="button" onClick={() => carouselRef.current?.next()}>
                    <RightOutlined />
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="trending-blogs-home-empty">
              No trending blogs available for this period.
            </div>
          )}
        </div>
      </MiddleContentWrapper>
    </section>
  );
};

export default TrendingBlogsSection;
