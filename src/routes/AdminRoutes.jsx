import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAdmin from '@/components/RequireAdmin.jsx';
import { useAuth } from '@/lib/authContext.jsx';

const Dashboard = React.lazy(() => import('@/components/Dashboard.jsx'));
const DashboardOrderDetailsPage = React.lazy(() => import('@/pages/DashboardOrderDetailsPage.jsx'));
const AdminLoginPage = React.lazy(() => import('@/pages/AdminLoginPage.jsx'));

const AdminRoutes = ({ dashboardProps = {} }) => {
  const { login } = useAuth();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path=""
          element={
            <RequireAdmin>
              <Dashboard {...dashboardProps} />
            </RequireAdmin>
          }
        />
        <Route
          path="orders/:id"
          element={
            <RequireAdmin>
              <DashboardOrderDetailsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="login"
          element={<AdminLoginPage onLogin={(user) => login(user, { isAdmin: true })} />}
        />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
