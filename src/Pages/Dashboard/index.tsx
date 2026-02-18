import React from "react";

import "./Dashboard.css";
import {
  ArrowRightOutlined,
  PlayCircleOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

// Local Assets
import HeroImage from "@/assets/images/hero.png";

import StoryImage from "@/assets/images/story.png";
import { useFetchTrendingBlogsCategories } from "@/services/userHomepageServices/homepageServices";
import CategoryCard from "@/Pages/Dashboard/components/CategoryCard";

const Dashboard: React.FC = () => {
  const { data } = useFetchTrendingBlogsCategories({});

  console.log("data category", data);

  return (
    <div className="new-dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <img src={HeroImage} alt="Hero Mountain" className="hero-bg" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="hero-badge">✨ New Adventure</span>
            <h1 className="hero-title">Unfold Your Next Great Adventure</h1>
            <p className="hero-subtitle">
              Experience breathtaking mountain landscapes and curated trek
              stories from the world's most remote peaks.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                Explore Adventures <ArrowRightOutlined />
              </button>
              <button className="btn-secondary">
                <PlayCircleOutlined /> Watch Story
              </button>
            </div>
          </div>
        </div>
      </section>

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

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-icon">
          <CompassOutlined />
        </div>
        <h2 className="newsletter-title cabin-sketch-bold">
          The Trailhead Dispatch
        </h2>
        <p className="newsletter-subtitle">
          Join 20,000+ adventurers. Weekly trek reports, gear testing, and
          hidden gems delivered to your inbox.
        </p>
        <div className="newsletter-form">
          <input type="email" placeholder="Your email address" />
          <button>Subscribe</button>
        </div>
        <p style={{ marginTop: "20px", fontSize: "12px", opacity: 0.6 }}>
          No spam. Only high-altitude inspiration. Unsubscribe anytime.
        </p>
      </section>

      {/* Branding Footer Note */}
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#999",
          fontSize: "14px",
        }}
      >
        © 2026 Era Escape. All paths lead home.
      </div>
    </div>
  );
};

export default Dashboard;
