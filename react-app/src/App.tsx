import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Admin from "./Pages/Admin_Portal/Admin";
import Authentication from "./Pages/Authentication/Authentication";
import CreateAccount from "./Pages/createAccount/createAccount";
import Login from "./Pages/login/login";
import Overview from "./Pages/Overview/Overview";
import Purchasing from "./Pages/Purchasing_Currency/Purchasing";
import Transactions from "./Pages/Transactions/Transactions";
import Withdrawals from "./Pages/Withdrawals/Withdrawals";
import Navbar from "./Components/Navbar/Navbar";
import AdminTransactionView from "./Pages/AdminTransactionView/AdminTransactionView";
import { AuthProvider } from "./Context/AuthContext";
import { useAuth } from "./Context/AuthContext";
import { useState, useEffect } from "react";
import { fetchUserDetails } from "./Components/Navbar/Navbar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavRoutes />
      </AuthProvider>
    </Router>
  );
}

function NavRoutes() {
  const auth = useAuth();
  const location = useLocation();
  const noNavbarRoutes = ["/login", "/authentication", "/"];
  const [user, setUser] = useState<any>(null);

  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  const contentStyle = showNavbar
    ? { flex: 1, marginLeft: "264px" }
    : {
        height: "100vh",
        width: "100vw",
      };

  useEffect(() => {
    fetchUserDetails(setUser);
  }, []);

  return (
    <>
      {showNavbar && <Navbar />}
      <div style={contentStyle}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/" element={<CreateAccount />} />
          <Route
            path="/admin"
            element={
              auth?.isLoggedIn && user?.role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/overview"
            element={
              auth?.isLoggedIn ? <Overview /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/purchasing"
            element={
              auth?.isLoggedIn ? (
                <Purchasing />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/transactions"
            element={
              auth?.isLoggedIn ? (
                <Transactions />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/withdrawals"
            element={
              auth?.isLoggedIn ? (
                <Withdrawals />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/transactions/:user_id"
            element={
              auth?.isLoggedIn ? (
                <AdminTransactionView />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
