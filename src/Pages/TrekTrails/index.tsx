import React from 'react';
import { Button, Tag, Typography, Card, Row, Col, Divider } from 'antd';
import { 
  FaHiking, 
  FaMountain, 
  FaClock, 
  FaRoute, 
  FaMapMarkedAlt, 
  FaCloudSun, 
  FaWind, 
  FaSun, 
  FaExclamationTriangle,
  FaShare,
  FaBookmark,
  FaDownload,
  FaWalking
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { trekData } from './dummyData';
import MiddleContentWrapper from '@/components/ContentWrappers/MiddleContentWrapper';

const { Title, Text, Paragraph } = Typography;

const TrekTrails: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Hero Section */}
      <div style={{ 
        position: 'relative', 
        height: '500px', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', // Dummy image of mountains
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '40px'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))' 
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
          <div style={{ marginBottom: '16px' }}>
            <Tag color="#108ee9" style={{ border: 'none', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' }}>{trekData.difficulty.toUpperCase()}</Tag>
            <Tag color="#555" style={{ border: 'none', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' }}>{trekData.type.toUpperCase()}</Tag>
          </div>
          <Title level={1} style={{ color: 'white', margin: '0 0 8px 0', fontSize: '48px' }}>{trekData.title}</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={{ color: '#ddd', fontSize: '16px' }}>
              <FaMapMarkedAlt style={{ marginRight: '8px' }} />
              {trekData.location}
            </Text>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button icon={<FaBookmark />} style={{ borderRadius: '8px' }}>Save</Button>
              <Button icon={<FaShare />} style={{ borderRadius: '8px' }}>Share</Button>
            </div>
          </div>
        </div>
      </div>

      <MiddleContentWrapper extraStyles={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#2ecc71', fontSize: '24px', marginBottom: '8px' }}><FaHiking /></div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>DISTANCE</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{trekData.stats.distance}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#2ecc71', fontSize: '24px', marginBottom: '8px' }}><FaMountain /></div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>ELEVATION</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{trekData.stats.elevation}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#2ecc71', fontSize: '24px', marginBottom: '8px' }}><FaClock /></div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>EST. TIME</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{trekData.stats.time}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#2ecc71', fontSize: '24px', marginBottom: '8px' }}><FaRoute /></div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>ROUTE TYPE</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{trekData.stats.routeType}</div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Main Content Column */}
          <Col xs={24} lg={16}>
            {/* About Section */}
            <Card bordered={false} style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Title level={3}>About this trail</Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
                {trekData.description}
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
                <Text strong style={{ color: '#2ecc71' }}>Note: </Text>
                {trekData.note}
              </Paragraph>
              <div style={{ marginTop: '20px' }}>
                {trekData.tags.map(tag => (
                  <Tag key={tag} style={{ padding: '6px 16px', borderRadius: '20px', background: '#f0f2f5', border: 'none', fontSize: '14px', margin: '0 8px 8px 0' }}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Elevation Profile */}
            <Card bordered={false} style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Title level={3} style={{ margin: 0 }}>Elevation Profile</Title>
                <Text type="secondary">Max Elevation: <strong style={{ color: '#000' }}>{trekData.stats.elevation}</strong></Text>
              </div>
              
              {/* Recharts Elevation Chart */}
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trekData.elevationProfile}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="dist" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="elev" stroke="#2ecc71" fillOpacity={1} fill="url(#colorElev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Sidebar Column */}
          <Col xs={24} lg={8}>
            {/* Map Preview Card */}
            <Card 
              bordered={false} 
              style={{ padding: 0, borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ position: 'relative', height: '200px', backgroundColor: '#e0e0e0' }}>
                {/* Map preview image */}
                <img 
                  src="./images/dummyTrailImage.png" 
                  alt="Map Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(1px)' }} 
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2
                }}>
                  <Button 
                    type="default" 
                    icon={<FaMapMarkedAlt />} 
                    style={{ fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                    onClick={() => navigate('/trek-trails/map')}
                  >
                    View Interactive Map
                  </Button>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <Title level={4} style={{ marginTop: 0 }}>Trail Actions</Title>
                <Button type="primary" block icon={<FaWalking />} size="large" style={{ marginBottom: '12px', backgroundColor: '#2ecc71', borderColor: '#2ecc71', height: '48px', fontSize: '16px' }}>
                  Start Navigation
                </Button>
                <Button block icon={<FaDownload />} size="large" style={{ height: '48px', fontSize: '16px' }}>
                  Download GPX
                </Button>
              </div>
            </Card>

            {/* Current Conditions */}
            <Card bordered={false} style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={4} style={{ margin: 0 }}>Current Conditions</Title>
                <Tag color="green">Live</Tag>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FaCloudSun style={{ fontSize: '48px', color: '#f39c12', marginRight: '16px' }} />
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{trekData.conditions.temp}</div>
                  <div style={{ color: '#666' }}>{trekData.conditions.weather}</div>
                </div>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ fontSize: '12px', color: '#888' }}>Wind</div>
                  <div style={{ fontWeight: 'bold' }}><FaWind style={{ marginRight: '6px' }} /> {trekData.conditions.wind}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: '12px', color: '#888' }}>Sunset</div>
                  <div style={{ fontWeight: 'bold' }}><FaSun style={{ marginRight: '6px' }} /> {trekData.conditions.sunset}</div>
                </Col>
              </Row>
            </Card>

            {/* Bear Activity Warning */}
            <Card bordered={false} style={{ borderRadius: '12px', backgroundColor: '#fff7e6', border: '1px solid #ffe58f' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <FaExclamationTriangle style={{ color: '#faad14', fontSize: '24px', marginTop: '4px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#d46b08', marginBottom: '4px' }}>Bear Activity</div>
                  <div style={{ fontSize: '13px', color: '#d46b08' }}>
                    Recent bear sightings near the Panorama Point. Carry bear spray and hike in groups.
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </MiddleContentWrapper>
    </div>
  );
}

export default TrekTrails;