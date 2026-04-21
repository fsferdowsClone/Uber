/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { AppFeatures, DownloadSection } from "@/components/ExtraSections";
import { Footer } from "@/components/Footer";
import { EmployeeBoard } from "@/pages/EmployeeBoard";
import { Payments } from "@/pages/Payments";
import { DriverDashboard } from "@/pages/DriverDashboard";

import { Toaster } from "sonner";

function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <AppFeatures />
      <DownloadSection />
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white selection:bg-black selection:text-white relative">
        <Toaster position="bottom-right" richColors toastOptions={{
          style: {
            borderRadius: '1.5rem',
            border: '1px solid rgba(0,0,0,0.05)',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(16px)',
          }
        }} />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employee" element={<EmployeeBoard />} />
          <Route path="/wallet" element={<Payments />} />
          <Route path="/driver" element={<DriverDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

