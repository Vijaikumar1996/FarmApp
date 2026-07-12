import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import MonthlySalesChart from "../../components/dashboard/PendingPayments";
import PageMeta from "../../components/common/PageMeta";
import RecentOrders from "../../components/dashboard/RecentOrders";

import { useDashboard } from "../../queries/useDashboard";
import RecentScanActivity from "../../components/dashboard/PendingPayments";
import PendingPayments from "../../components/dashboard/PendingPayments";

export default function Home() {
  return (
    <>
      <PageMeta title="Dhariya Farms - Dashboard" description="Dashboard" />

      <div className="grid grid-cols-12 gap-4 md:gap-2 items-stretch">
        {/* Metrics */}
        <div className="col-span-12">
          <DashboardMetrics />
        </div>

        {/* Chart */}

        {/* Recent Payments */}
        {/* <div className="col-span-12 xl:col-span-6">
          <RecentPayments />
        </div> */}

        <div className="col-span-12 xl:col-span-6 h-full">
          <RecentOrders />
        </div>

        <div className="col-span-12 xl:col-span-6 h-full">
          <PendingPayments />
        </div>
      </div>
    </>
  );
}
