
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FlashSalePage from '@/pages/FlashSalePage';
import AdminFlashSalesPage from '@/pages/admin/AdminFlashSalesPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import SecureRoute from '@/components/SecureRoute';

const FlashSaleRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/flash-sale/:id" element={<FlashSalePage />} />
      <Route 
        path="/admin/flash-sales" 
        element={
          <ProtectedRoute>
            <SecureRoute>
              <AdminFlashSalesPage />
            </SecureRoute>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default FlashSaleRoutes;
