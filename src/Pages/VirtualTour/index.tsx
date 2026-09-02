import React, { useState } from 'react';
import { ConfigProvider, Layout, theme } from 'antd';
import Sidebar from '@/Pages/VirtualTour/components/Sidebar';
import MainViewer from '@/Pages/VirtualTour/components/MainViewer';
import InfoPanel from '@/Pages/VirtualTour/components/InfoPanel';
import { virtualTourData } from '@/Pages/VirtualTour/VirtualTourDummyData/enrichedVirtualTourData';
import { ViewMode } from '@/Pages/VirtualTour/types';
import '@/Pages/VirtualTour/VirtualTour.css';

const { Content, Sider } = Layout;

const VirtualTour: React.FC = () => {
  const { trek } = virtualTourData;
  const [activeDestinationIndex, setActiveDestinationIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('image');

  const activeDestination = trek.destinations[activeDestinationIndex];

  const handleNext = () => {
    if (activeDestinationIndex < trek.destinations.length - 1) {
      setActiveDestinationIndex(prev => prev + 1);
      setViewMode('image');
    }
  };

  const handlePrev = () => {
    if (activeDestinationIndex > 0) {
      setActiveDestinationIndex(prev => prev - 1);
      setViewMode('image');
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          colorBgContainer: '#141414',
          colorBgLayout: '#000000',
        },
      }}
    >
      <Layout className="virtual-tour-layout">
        <Sider width={280} className="vt-sidebar" theme="dark">
          <Sidebar
            trek={trek}
            activeIndex={activeDestinationIndex}
            onSelectDestination={setActiveDestinationIndex}
          />
        </Sider>
        
        <Content className="vt-main-content">
          <MainViewer
            destination={activeDestination}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={activeDestinationIndex < trek.destinations.length - 1}
            hasPrev={activeDestinationIndex > 0}
          />
        </Content>

        <Sider width={350} className="vt-info-panel" theme="dark" style={{ overflowY: 'auto' }}>
          <InfoPanel destination={activeDestination} />
        </Sider>
      </Layout>
    </ConfigProvider>
  );
};

export default VirtualTour;