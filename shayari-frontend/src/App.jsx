import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import Navbar from "./components/Navbar";
import SignInForm from "./forms/SignInForm";
import RegisterForm from "./forms/RegisterForm";
import HomePage from "./components/Pages/HomePage";
import AddShayari from "./components/AddShayari";
import Profile from "./pages/Profile";
import MyShayaris from "./pages/MyShayaris";
import EditShayari from "./pages/EditShayari";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/login" element={<SignInForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/addShayari" 
                  element={
                    <ProtectedRoute>
                      <AddShayari />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/profile/:username" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/my-shayaris" 
                  element={
                    <ProtectedRoute>
                      <MyShayaris />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/edit-shayari/:id" 
                  element={
                    <ProtectedRoute>
                      <EditShayari />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/explore" 
                  element={
                    <ProtectedRoute>
                      <Explore />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
