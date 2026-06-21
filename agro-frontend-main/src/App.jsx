import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


// ================= AUTH =================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ================= LAYOUT =================

import MainLayout from "./layouts/MainLayout";

// ================= PROTECTED =================

import ProtectedRoute from "./routes/ProtectedRoute";

// ================= DASHBOARD =================

import Dashboard from "./pages/dashboard/Dashboard";

// ================= FARMERS =================

import Farmers from "./pages/farmers/Farmers";
import AddFarmer from "./pages/farmers/AddFarmer";
import EditFarmer from "./pages/farmers/EditFarmer";
import FarmerDetails from "./pages/farmers/FarmerDetails";

// ================= PRODUCTS =================

import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import ProductDetails from "./pages/products/ProductDetails";

// ================= TRANSACTIONS =================

import Transactions from "./pages/transactions/Transactions";
import CreditTransaction from "./pages/transactions/CreditTransaction";
import PaymentTransaction from "./pages/transactions/PaymentTransaction";
import InterestTransaction from "./pages/transactions/InterestTransaction";

// ================= INVOICES =================

import Invoices from "./pages/invoices/Invoices";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";
import PrintInvoice from "./pages/invoices/PrintInvoice";
import Billing from "./pages/billing/Billing";

// ================= REPORTS =================

import Reports from "./pages/reports/Reports";

// ================= VILLAGES =================

import Villages from "./pages/villages/Villages";
import VillageDetails from "./pages/villages/VillageDetails";

// ================= SETTINGS =================

import Settings from "./pages/settings/Settings";

// ================= INTEREST MODULE =================

import Interest from "./pages/Interest";

// ================= LEDGER =================

import FarmerLedger from "./components/farmers/FarmerLedger";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= DEFAULT ================= */}

        <Route
          path="/"
          element={
            <Navigate to="/dashboard" />
          }
        />



        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />



        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Dashboard />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= FARMERS ================= */}

        <Route
          path="/farmers"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Farmers />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/farmers/add"
          element={
            <ProtectedRoute>

              <MainLayout>
                <AddFarmer />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/farmers/edit/:id"
          element={
            <ProtectedRoute>

              <MainLayout>
                <EditFarmer />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/farmers/:id"
          element={
            <ProtectedRoute>

              <MainLayout>
                <FarmerDetails />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= PRODUCTS ================= */}

        <Route
          path="/products"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Products />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/products/add"
          element={
            <ProtectedRoute>

              <MainLayout>
                <AddProduct />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>

              <MainLayout>
                <EditProduct />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>

              <MainLayout>
                <ProductDetails />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= TRANSACTIONS ================= */}

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Transactions />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/credit"
          element={
            <ProtectedRoute>

              <MainLayout>
                <CreditTransaction />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/payment"
          element={
            <ProtectedRoute>

              <MainLayout>
                <PaymentTransaction />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions/interest"
          element={
            <ProtectedRoute>

              <MainLayout>
                <InterestTransaction />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= INVOICES ================= */}

        <Route
          path="/invoices"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Invoices />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/create"
          element={
            <ProtectedRoute>

              <MainLayout>
                <CreateInvoice />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Billing />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/:id"
          element={
            <ProtectedRoute>

              <MainLayout>
                <InvoiceDetails />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/print/:id"
          element={
            <ProtectedRoute>

              <MainLayout>
                <PrintInvoice />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= REPORTS ================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Reports />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= VILLAGES ================= */}

        <Route
          path="/villages"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Villages />
              </MainLayout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/villages/:villageName"
          element={
            <ProtectedRoute>

              <MainLayout>
                <VillageDetails />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= SETTINGS ================= */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>

              <MainLayout>
                <Settings />
              </MainLayout>

            </ProtectedRoute>
          }
        />

{/* ================= INTEREST MODULE ================= */}

<Route
  path="/interest"
  element={
    <ProtectedRoute>

      <MainLayout>
        <Interest />
      </MainLayout>

    </ProtectedRoute>
  }
/>

        {/* ================= FARMER LEDGER ================= */}

        <Route
          path="/ledger/:id"
          element={
            <ProtectedRoute>

              <MainLayout>
                <FarmerLedger />
              </MainLayout>

            </ProtectedRoute>
          }
        />



        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <div className="h-screen flex items-center justify-center text-3xl font-bold">
              404 Page Not Found
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;