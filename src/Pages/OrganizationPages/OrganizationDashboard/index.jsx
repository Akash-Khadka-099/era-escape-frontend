import AdminWrappers from "@/components/ContentWrappers/AdminWrappers";
import OrganizationCards from "@/components/OrganizationCards";
import { useFetchOrganizationDashboardCards } from "@/services/organizationServices/organizationDashboard";

const OrganizationDashboard = () => {
  const { data } = useFetchOrganizationDashboardCards();

  console.log("data", data);
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
