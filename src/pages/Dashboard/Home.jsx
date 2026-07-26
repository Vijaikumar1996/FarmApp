

import PageMeta from "../../components/common/PageMeta";
import RecentOrders from "./RecentOrders";

import { useDashboard } from "../../queries/useDashboard";
import RecentScanActivity from "./PendingPayments";
import PendingPayments from "./PendingPayments";
import DashboardMetrics from "./DashboardMetrics";

export default function Home() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageMeta title="Dashboard" description="Dashboard" />

      <div className="grid grid-cols-12 gap-4 md:gap-2">
        <div className="col-span-12">
          <DashboardMetrics data={data} />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <RecentOrders data={data?.recentRequests} />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <PendingPayments data={data?.pendingPayments} />
        </div>
      </div>
    </>
  );
}
