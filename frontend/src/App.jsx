import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import Dashboard from "./pages/Dashboard";
import SwapMarketplace from './pages/SwapMarketplace';
import SwapRequests from './pages/SwapRequests';
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

// Wrapper to show Navbar only on specific routes
function LayoutWithNavbar({ children }) {
  const location = useLocation();
  const hideNavbar = ["/signup", "/logIn", "/create-event"].includes(location.pathname); 

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutWithNavbar>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/logIn" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-event/:id"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <SwapMarketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <SwapRequests />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LayoutWithNavbar>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  )
}

export default App
