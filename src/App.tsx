import React from "react";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import "./index.css";
import Layout from "./components/Layout/Layout";
import CustomersPage from "./pages/Dashboard/Customers/CustomerPage";
import { Routes, Route } from "react-router-dom";
import OfficersPage from "./pages/Dashboard/Officers/OfficerPage";
import VerifyCustomersPage from "./pages/Dashboard/Customers/VerifyCustomersPage";
import ProductPage from "./pages/Dashboard/Product/ProductPage";
const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Layout
              activePage="dashboard"
              pageTitle="Dashboard"
              pageSubtitle="Welcome to the CIS Portal Dashboard"
            >
              <DashboardPage />
            </Layout>
          }
        />
        <Route
          path="/customers"
          element={
            <Layout
              activePage="customers"
              pageTitle="Manage Customers"
              pageSubtitle="View and manage all registered customers"
            >
              <CustomersPage />
            </Layout>
          }
        />
        <Route path="/verify"
        element={
          <Layout
            activePage="verify"
            pageTitle="Verify Customers"
            pageSubtitle="Verify customer identities and documents"
          >
            <VerifyCustomersPage />
          </Layout>
        }
        />

        <Route path="/officers"
        element={
          <Layout
            activePage="officers"
            pageTitle="Manage Officers"
            pageSubtitle="View and manage all system officers"
          >
            <OfficersPage />
          </Layout>
        }
          />
        <Route path="/products"
        element={
          <Layout
          activePage="Products"
          pageTitle="Manage Products"
          pageSubtitle="View and manage all Products"
          >
            <ProductPage/>
          </Layout>
        } />
      </Routes>
    </div>
  );
};

export default App;
