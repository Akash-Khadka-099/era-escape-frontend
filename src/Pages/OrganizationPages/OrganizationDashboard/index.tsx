import React from "react";
import AdminWrappers from "@/components/ContentWrappers/AdminWrappers";
import OrganizationCards from "@/components/OrganizationCards";
import { useFetchOrganizationDashboardCards } from "@/services/organizationServices/organizationDashboard";

const OrganizationDashboard: React.FC = () => {
  const { data } = useFetchOrganizationDashboardCards();

  return (
    <>
      <AdminWrappers>
        <div className="py-4">
          <OrganizationCards data={data} />
        </div>
      </AdminWrappers>
    </>
  );
};

export default OrganizationDashboard;
