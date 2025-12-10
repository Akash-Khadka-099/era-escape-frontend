import React, { useMemo } from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  DashboardOutlined,
  HeartOutlined,
  //   CloudOutlined,
  //   FireOutlined,
  //   SmileOutlined,
  //   ColumnWidthOutlined,
  //   ColumnHeightOutlined,
} from "@ant-design/icons";

interface OrganizationData {
  totalPackages?: number;
  totalActivePackages?: number;
  // Add other properties as needed
}

interface OrganizationCardsProps {
  data: OrganizationData;
}

const OrganizationCards: React.FC<OrganizationCardsProps> = ({ data }) => {
  const cards = useMemo(
    () => [
      {
        name: "Total Packages",
        value: data?.totalPackages || 0,
        // unit: "mmHg",
        icon: <DashboardOutlined />,
        color: "#1890FF",
        unit: "",
      },
      {
        name: "Total Active Packages",
        value: data?.totalActivePackages || 0,
        // unit: "bpm",
        icon: <HeartOutlined />,
        color: "#52C41A",
        unit: "",
      },
      //   {
      //     name: "Respiratory Rate",
      //     value: data?.respiratoryRate || 0,
      //     unit: "breaths/min",
      //     icon: <CloudOutlined />,
      //     color: "#1890FF",
      //   },
      //   {
      //     name: "Temperature",
      //     value: vitalDetails?.temperatureCelsius,
      //     unit: "°C",
      //     icon: <FireOutlined />,
      //     color: "#FA8C16",
      //   },
      //   {
      //     name: "Oxygen Level",
      //     value: vitalDetails?.oxygenSaturation,
      //     unit: "%",
      //     icon: <SmileOutlined />,
      //     color: "#52C41A",
      //   },
      //   {
      //     name: "Weight",
      //     value: vitalDetails?.weight,
      //     unit: "kg",
      //     icon: <ColumnWidthOutlined />,
      //     color: "#722ED1",
      //   },
      //   {
      //     name: "Height",
      //     value: vitalDetails?.height,
      //     unit: vitalDetails?.heightUnit,
      //     icon: <ColumnHeightOutlined />,
      //     color: "#FADB14",
      //   },
    ],
    [data]
  );

  return (
    <Row gutter={[16, 16]}>
      {cards.map((vital, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={index}>
          <Card hoverable style={{ borderLeft: `4px solid ${vital.color}` }}>
            <Statistic
              title={
                <span>
                  {React.cloneElement(vital.icon, {
                    style: { color: vital.color, marginRight: 8 },
                  })}
                  {vital.name}
                </span>
              }
              value={vital.value}
              suffix={vital.value ? vital.unit : ""}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default OrganizationCards;
