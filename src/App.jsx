import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/DashboardV2';
import Habits from './pages/Habits';
import Planner from './pages/Planner';
import AccountPage from './pages/AccountPage';

import Accountability from './pages/Accountability';
import SharedView from './pages/SharedView';
import AuthPage from './pages/AuthPageV2';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public routes (no auth required) */}
      <Route path="/shared/:code" element={<SharedView />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/account" element={<AccountPage />} />

        <Route path="/accountability" element={<Accountability />} />
      </Route>
    </Routes>
  );
}

export default App;
