import React from 'react';
import { Typography, Row, Col, Card, Tag, Divider, Rate, Space } from 'antd';
import { CloudOutlined, ArrowUpOutlined, SwapOutlined, WarningOutlined, RightOutlined } from '@ant-design/icons';
import { Destination } from '@/Pages/VirtualTour/types';

const { Title, Text } = Typography;

interface InfoPanelProps {
  destination: Destination;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ destination }) => {
  return (
    <div style={{ color: 'white' }}>
      <Title level={2} style={{ color: 'white', margin: 0 }}>
        {destination.name}
      </Title>
      
      <Space size="middle" style={{ marginTop: 12, marginBottom: 24 }}>
        <Tag color="blue" icon={<CloudOutlined />} style={{ border: 'none', background: 'rgba(22, 119, 255, 0.15)' }}>
          {destination.weather.temperatureRange.min} to {destination.weather.temperatureRange.max}{destination.weather.temperatureRange.unit}
        </Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {destination.altitude}m ASL • {destination.latLong[0].toFixed(4)}° N, {destination.latLong[1].toFixed(4)}° E
        </Text>
      </Space>

      <Row gutter={16}>
        <Col span={12}>
          <Card 
            size="small" 
            bordered={false} 
            style={{ background: 'rgba(255,255,255,0.05)', marginBottom: 16 }}
          >
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase' }}><SwapOutlined /> Total Distance</Text>
            <Title level={4} style={{ color: 'white', margin: '4px 0 0' }}>
              {destination.distanceFromPrevious || 0} <span style={{ fontSize: 12, fontWeight: 'normal', color: '#888' }}>km</span>
            </Title>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            size="small" 
            bordered={false} 
            style={{ background: 'rgba(255,255,255,0.05)', marginBottom: 16 }}
          >
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase' }}><ArrowUpOutlined /> Altitude</Text>
            <Title level={4} style={{ color: 'white', margin: '4px 0 0' }}>
              {destination.altitude} <span style={{ fontSize: 12, fontWeight: 'normal', color: '#888' }}>m</span>
            </Title>
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Difficulty</Text>
        <Text style={{ color: destination.difficultyRating === 'Extreme' ? '#ff4d4f' : destination.difficultyRating === 'Challenging' ? '#faad14' : '#52c41a', fontWeight: 'bold' }}>
          {destination.difficultyRating} {destination.difficultyRating === 'Extreme' && <WarningOutlined />}
        </Text>
      </div>

      <Divider style={{ borderColor: '#333' }} />

      <Title level={5} style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>AVAILABLE FACILITIES</Title>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {destination.facilities.map((fac, idx) => (
          <Tag 
            key={idx} 
            style={{ 
              background: fac.available ? 'rgba(255,255,255,0.08)' : 'transparent', 
              border: fac.available ? '1px solid transparent' : '1px dashed #444',
              color: fac.available ? '#ddd' : '#666',
              padding: '4px 10px',
              borderRadius: 6
            }}
          >
            {fac.icon} {fac.name}
          </Tag>
        ))}
      </div>

      {destination.stays && destination.stays.length > 0 && (
        <>
          <Title level={5} style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>FEATURED STAYS</Title>
          {destination.stays.map((stay, idx) => (
            <Card 
              key={idx}
              size="small" 
              bordered={false}
              hoverable
              style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
              bodyStyle={{ padding: 8, display: 'flex', width: '100%', gap: 12, alignItems: 'center' }}
            >
              <img 
                src={stay.image} 
                alt={stay.name} 
                style={{ width: 60, height: 60, borderRadius: 6, objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <Text strong style={{ color: 'white', display: 'block', fontSize: 14 }}>{stay.name}</Text>
                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{stay.type}</Text>
                <Rate disabled defaultValue={stay.rating} style={{ fontSize: 10, color: '#faad14', margin: 0 }} />
              </div>
              <RightOutlined style={{ color: '#888' }} />
            </Card>
          ))}
        </>
      )}

      {destination.tips && destination.tips.length > 0 && (
        <>
          <Divider style={{ borderColor: '#333' }} />
          <Title level={5} style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>TIPS</Title>
          <ul style={{ paddingLeft: 16, color: '#ccc', margin: 0, fontSize: 13, lineHeight: '1.6' }}>
            {destination.tips.map((tip, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{tip}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default InfoPanel;
