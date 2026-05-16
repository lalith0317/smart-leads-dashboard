import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, booting } = useAuth();

  if (booting) {
    return <div className="grid min-h-screen place-items-center bg-[#f7f8f4] text-ink dark:bg-[#121516] dark:text-zinc-100">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
