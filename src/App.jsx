import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DemoAccountBar } from './components/DemoAccountBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { CreateServicePage } from './pages/CreateServicePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ExchangesPage } from './pages/ExchangesPage';
import { ExchangeDetailPage } from './pages/ExchangeDetailPage';
import { FreelancersPage } from './pages/FreelancersPage';
import { FreelancerProfilePage } from './pages/FreelancerProfilePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletPage } from './pages/WalletPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="relative min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
            {/* Atmospheric Non-Dull Background with Luxury Ambient Gradient Orbs & Dot Texture */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
              {/* Top ambient emerald & teal glow */}
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-emerald-400/20 via-teal-300/15 to-purple-400/15 rounded-full blur-[130px]" />
              {/* Mid-left indigo glow */}
              <div className="absolute top-[30%] -left-40 w-[650px] h-[650px] bg-gradient-to-br from-indigo-300/15 via-purple-300/10 to-transparent rounded-full blur-[140px]" />
              {/* Mid-right teal & emerald glow */}
              <div className="absolute top-[60%] -right-40 w-[700px] h-[700px] bg-gradient-to-bl from-teal-400/15 via-emerald-300/10 to-transparent rounded-full blur-[140px]" />
              {/* Subtle designer micro-dot pattern texture */}
              <div className="absolute inset-0 bg-dot-pattern opacity-50" />
            </div>

            {/* Quick Demo Switcher Bar */}
            <DemoAccountBar />

            {/* Main Navigation */}
            <Navbar />

            {/* Main View Router */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* Services */}
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route path="/services/create" element={<CreateServicePage />} />

                {/* Projects */}
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/projects/create" element={<CreateProjectPage />} />

                {/* Skill Exchanges */}
                <Route path="/exchanges" element={<ExchangesPage />} />
                <Route path="/exchanges/:id" element={<ExchangeDetailPage />} />

                {/* Freelancers & Talent */}
                <Route path="/freelancers" element={<FreelancersPage />} />
                <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />

                {/* Workspace Collaboration */}
                <Route path="/workspace/:id" element={<WorkspacePage />} />

                {/* User Dashboards */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
