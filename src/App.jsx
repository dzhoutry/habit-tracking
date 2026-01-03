
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/DashboardV2';
import Habits from './pages/Habits';
import Planner from './pages/Planner';
import AccountPage from './pages/AccountPage';

import Accountability from './pages/Accountability';
import SharedView from './pages/SharedView';
import AuthPage from './pages/AuthPageV2';
import LandingPageV2 from './pages/LandingPageV2';
import './App.css';

function RootRoute() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPageV2 />;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/landing" element={<LandingPageV2 />} />
      <Route path="/shared/:code" element={<SharedView />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/accountability" element={<Accountability />} />
      </Route>
    </Routes>
  );
}

export default App;
