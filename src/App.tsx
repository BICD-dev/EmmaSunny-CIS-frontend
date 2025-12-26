import React from "react";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import "./index.css";
import Layout from "./components/Layout/Layout";
import CustomersPage from "./pages/Dashboard/Customers/CustomerPage";
import { Routes, Route } from "react-router-dom";
import OfficersPage from "./pages/Dashboard/Officers/OfficerPage";
import VerifyCustomersPage from "./pages/Dashboard/Customers/VerifyCustomersPage";
import ProductPage from "./pages/Dashboard/Product/ProductPage";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import CustomerDetailsPage from "./pages/Dashboard/Customers/CustomerDetailsPage";
const App: React.FC = () => {
  return (
    <div className="App">
       <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login"
        element={
          <Login/>
        }/>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
            <Layout
              activePage="dashboard"
              pageTitle="Dashboard"
              pageSubtitle="Welcome to the CIS Portal Dashboard"
            >
              <DashboardPage />
            </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
            <Layout
              activePage="customers"
              pageTitle="Manage Customers"
              pageSubtitle="View and manage all registered customers"
            >
              <CustomersPage />
            </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <PrivateRoute>
            <Layout
              activePage="customer"
              pageTitle="Manage Customer Details"
              pageSubtitle="View details of a customer"
            >
              <CustomerDetailsPage />
            </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/verify"
        element={
          <PrivateRoute>
          <Layout
            activePage="verify"
            pageTitle="Verify Customers"
            pageSubtitle="Verify customer identities and documents"
          >
            <VerifyCustomersPage />
          </Layout>
          </PrivateRoute>
        }
        />

        <Route path="/officers"
        element={
          <PrivateRoute>
          <Layout
            activePage="officers"
            pageTitle="Manage Officers"
            pageSubtitle="View and manage all system officers"
          >
            <OfficersPage />
          </Layout>
          </PrivateRoute>
        }
          />
        <Route path="/products"
        element={
          <PrivateRoute>
          <Layout
          activePage="products"
          pageTitle="Manage Products"
          pageSubtitle="View and manage all Products"
          >
            <ProductPage/>
          </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
