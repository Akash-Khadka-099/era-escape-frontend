import React from 'react';
import { Drawer, Slider, Card, Button, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TrailLocationDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

const dummyHotels = [
  {
    id: 1,
    name: "Mountain View Lodge",
    type: "Guesthouse",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 2,
    name: "River's Edge Hotel",
    type: "Hotel",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 3,
    name: "Alpine Base Camp",
    type: "Lodge",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  }
];

const TrailLocationDrawer: React.FC<TrailLocationDrawerProps> = ({ open, onClose, title }) => {
  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      mask={true}
    >
      <div style={{ marginBottom: '32px' }}>
        <Title level={5} style={{ marginBottom: '24px' }}>Price Range</Title>
        <div style={{ padding: '0 10px' }}>
            <Slider 
                range 
                defaultValue={[50, 300]} 
                min={0} 
                max={500} 
                marks={{ 50: 'Rs500', 300: 'Rs3000' }}
                trackStyle={[{ backgroundColor: '#2ecc71' }]}
                handleStyle={[
                    { borderColor: '#2ecc71', backgroundColor: '#000' },
                    { borderColor: '#2ecc71', backgroundColor: '#000' }
                ]}
            />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {dummyHotels.map(hotel => (
          <Card 
            key={hotel.id}
            hoverable
            cover={<img alt={hotel.name} src={hotel.image} style={{ height: '180px', objectFit: 'cover' }} />}
            bodyStyle={{ padding: '16px' }}
            style={{ borderRadius: '12px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <Title level={5} style={{ margin: 0 }}>{hotel.name}</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <StarFilled style={{ color: '#000', fontSize: '12px' }} />
                <Text strong style={{ fontSize: '12px' }}>{hotel.rating}</Text>
              </div>
            </div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '13px' }}>{hotel.type}</Text>
            <Button block style={{ backgroundColor: '#d1f2eb', color: '#000', border: 'none', fontWeight: '600', height: '40px' }}>
              View Details
            </Button>
          </Card>
        ))}
      </div>
    </Drawer>
  );
};

export default TrailLocationDrawer;
