import React from "react";

import "./Dashboard.css";
import { Button } from "antd";

import StoryImage from "@/assets/images/story.png";
import { useFetchTrendingBlogsCategories } from "@/services/userHomepageServices/homepageServices";
import CategoryCard from "@/Pages/Dashboard/components/CategoryCard";
import TrendingBlogsSection from "@/Pages/Dashboard/TrendingBlogsSection";
import ModernHero from "@/Pages/Dashboard/components/ModernHero";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";

const Dashboard: React.FC = () => {
  const { data } = useFetchTrendingBlogsCategories({});

  return (
    <div className="new-dashboard">
      <MiddleContentWrapper extraStyles={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
        <ModernHero />
      </MiddleContentWrapper>

      {/* Explore Landscapes Section */}
      <section className="explore-landscapes-section">
        <div className="explore-container">
          <div className="explore-header">
            <h2>Explore Landscapes</h2>
            <p>
              Discover your next journey through our curated categories, from
              the serene depths of tropical forests to the peak of the highest
              mountains.
            </p>
          </div>

          <div className="landscapes-grid">
            {data?.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <TrendingBlogsSection />

      {/* Featured Story Section */}
      <section className="featured-story">
        <div className="story-content">
          <span className="story-label">Voices from the Trail</span>
          <h2 className="story-title">The Silence of the High Atlas</h2>
          <p className="story-quote">
            "In the mountains, time doesn't exist in minutes. It exists in the
            movement of the shadow across the valley floor."
          </p>
          <p className="story-desc">
            An interview with veteran Berber guide Idriss on why we still seek
            the high places in a digital age.
          </p>
          <Button
            type="primary"
            size="large"
            style={{
              width: "fit-content",
              borderRadius: "12px",
              height: "50px",
              padding: "0 30px",
              fontWeight: 600,
            }}
          >
            Read Interview
          </Button>
        </div>
        <div className="story-image">
          <img src={StoryImage} alt="High Atlas" />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
