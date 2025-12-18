import React from "react";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import "./index.css";
import Layout from "./components/Layout/Layout";
import CustomersPage from "./pages/Dashboard/Customers/CustomerPage";
import { Routes, Route } from "react-router-dom";
const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
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
      </Routes>
    </div>
  );
};

export default App;
