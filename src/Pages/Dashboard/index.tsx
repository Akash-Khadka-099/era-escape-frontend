import React from "react";

import "./Dashboard.css";
import {
  ArrowRightOutlined,
  PlayCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";

// Local Assets
import HeroImage from "@/assets/images/hero.png";
import Trek1Image from "@/assets/images/trek1.png";
import StoryImage from "@/assets/images/story.png";
import { useFetchTrendingBlogsCategories } from "@/services/userHomepageServices/homepageServices";
import CategoryCard from "@/Pages/Dashboard/components/CategoryCard";

const Dashboard: React.FC = () => {
  const trendingTreks = [
    {
      id: 1,
      title: "The Great Himalayan Trail",
      desc: "Exploring the world's highest traverse across the roof of the world, from...",
      image: Trek1Image,
      tag: "Hard",
      duration: "15 MIN READ",
      location: "NEPAL",
      stat: "1,200km Total",
    },
    {
      id: 2,
      title: "Patagonian Peaks",
      desc: "Wind-swept landscapes and granite spires: a journey through Torres del Paine.",
      image:
        "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=1000&auto=format&fit=crop",
      tag: "Moderate",
      duration: "12 MIN READ",
      location: "CHILE",
      stat: "150m Gain",
    },
    {
      id: 3,
      title: "Alpine Wildflowers",
      desc: "A gentle descent through the Lauterbrunnen Valley surrounded by 72...",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
      tag: "Easy",
      duration: "8 MIN READ",
      location: "SWITZERLAND",
      stat: "12km Route",
    },
  ];

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

      {/* Trending Section */}
      <section className="trending-section">
        <div className="section-header">
          <div>
            <Tag
              color="orange"
              style={{ marginBottom: "8px", fontWeight: 600 }}
            >
              TOP PICKS
            </Tag>
            <h2>Currently Trending</h2>
          </div>
          <a href="/trek-trails" className="view-all">
            View All Treks <ArrowRightOutlined />
          </a>
        </div>

        <div className="trek-grid">
          {trendingTreks.map((trek) => (
            <div key={trek.id} className="trek-card">
              <div className="trek-image-wrapper">
                <img src={trek.image} alt={trek.title} className="trek-image" />
                <span className="trek-tag">{trek.tag}</span>
              </div>
              <div className="trek-info">
                <div className="trek-meta">
                  <span>
                    <ClockCircleOutlined /> {trek.duration}
                  </span>
                  <span>•</span>
                  <span>
                    <EnvironmentOutlined /> {trek.location}
                  </span>
                </div>
                <h3 className="trek-card-title">{trek.title}</h3>
                <p className="trek-card-desc">{trek.desc}</p>
                <div className="trek-card-footer">
                  <span className="trek-stat">{trek.stat}</span>
                  <a href="#" className="read-story">
                    READ STORY
                  </a>
                </div>
              </div>
            </div>
          ))}
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
        <h2 className="newsletter-title">The Trailhead Dispatch</h2>
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
