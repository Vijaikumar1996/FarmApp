import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import GlobalLoader from "./components/loader/GlobalLoader";
import Home from "./pages/Dashboard/Home";

import PrivateRoute from "./PrivateRoute";
import Users from "./pages/Users/Users";
import Areas from "./pages/Areas/Areas";
import Customers from "./pages/Customers/Customers";
import Products from "./pages/Products/Products";
import DeliveryVerification from "./pages/DeliveryVerification/DeliveryVerification";
import VerifyDelivery from "./pages/DeliveryVerification/VerifyDelivery";
import DeliveryPlanning from "./pages/DeliveryPlanning/DeliveryPlanning";
import Payments from "./pages/Payments/Payments";
import CustomerLedger from "./pages/Payments/CustomerLedger";
import Inventory from "./pages/Inventory/Inventory";
import CollectPayment from "./pages/Payments/CollectPayment";
import CustomerSubscription from "./pages/Subscriptions/CustomerSubscription";
import CreateSubscription from "./pages/Subscriptions/CreateSubscription";
import EditSubscription from "./pages/Subscriptions/EditSubscription";
import StockEntry from "./pages/Inventory/StockEntry";
import DeliveryLocations from "./pages/DeliveryLocation/DeliveryLocations";
import CustomerRequests from "./pages/Orders/CustomerRequests";
import CustomerRequestCreate from "./pages/Orders/CustomerRequestCreate";
import CustomerRequestEdit from "./pages/Orders/CustomerRequestEdit";
import CustomerRequestView from "./pages/Orders/CustomerRequestView";

export default function App() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching || isMutating;

  // ✅ Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {isLoading ? <GlobalLoader /> : null}

      <Router>
        <ScrollToTop />

        {/* ✅ Responsive Toaster */}
        <Toaster
          position={isMobile ? "bottom-center" : "top-center"}
          reverseOrder={false}
          gutter={8}
          containerStyle={isMobile ? { bottom: 20 } : { top: 20 }}
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
              zIndex: 999999,
              borderRadius: "8px",
              padding: "12px 16px",
            },
          }}
        />

        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/home" element={<Home />} />

              {/* Others Page */}
              <Route path="/areas" element={<Areas />} />
              <Route
                path="/deliverylocations"
                element={<DeliveryLocations />}
              />
              <Route path="/customers" element={<Customers />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/deliveryverification"
                element={<DeliveryVerification />}
              />
              <Route path="/verifydelivery/:id" element={<VerifyDelivery />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/users" element={<Users />} />
              <Route path="/customer-requests" element={<CustomerRequests />} />
              <Route path="/deliveryplanning" element={<DeliveryPlanning />} />
              <Route
                path="/customer-requests/create"
                element={<CustomerRequestCreate />}
              />
              <Route
                path="/customer-requests/edit/:id"
                element={<CustomerRequestEdit />}
              />
                 <Route
                path="/customer-requests/view/:id"
                element={<CustomerRequestView />}
              />
              <Route path="/payments" element={<Payments />} />

              <Route
                path="/payments/bill/:billingId"
                element={<CustomerLedger />}
              />

              <Route
                path="/payments/bill/:billingId/collect"
                element={<CollectPayment />}
              />
              <Route path="/subscriptions" element={<CustomerSubscription />} />
              <Route
                path="/subscriptions/create"
                element={<CreateSubscription />}
              />
              <Route
                path="/subscriptions/edit/:id"
                element={<EditSubscription />}
              />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/stockentry" element={<StockEntry />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
