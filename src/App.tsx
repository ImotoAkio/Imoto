import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Auth
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Genealogy from './pages/Genealogy';
import Timeline from './pages/Timeline';
import Gallery from './pages/Gallery';
import Stories from './pages/Stories';
import Profiles from './pages/Profiles';
import MemberProfile from './pages/MemberProfile';
import Documents from './pages/Documents';

// Admin Pages
import TreeBuilder from './pages/TreeBuilder';
import ArchiveManager from './pages/ArchiveManager';
import Cataloging from './pages/Cataloging';
import UsersManagement from './pages/admin/UsersManagement';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Public Content Routes */}
          <Route path="/tree" element={<Genealogy />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profile/:id" element={<MemberProfile />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Legal Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/tree" element={<ProtectedRoute requireAdmin><TreeBuilder /></ProtectedRoute>} />
          <Route path="/admin/archive" element={<ProtectedRoute requireAdmin><ArchiveManager /></ProtectedRoute>} />
          <Route path="/admin/cataloging" element={<ProtectedRoute requireAdmin><Cataloging /></ProtectedRoute>} />
          
          {/* Super Admin Routes */}
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UsersManagement /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
