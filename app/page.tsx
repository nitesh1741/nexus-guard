"use client";

import React from 'react';
import { Header } from '@/components/dashboard/Header';
import { IncidentForm } from '@/components/dashboard/IncidentForm';
import { DashboardOutput } from '@/components/dashboard/DashboardOutput';
import { useTriage } from '@/hooks/useTriage';

export default function EmergencyDashboard() {
  const { image, setImage, notes, setNotes, loading, report, error, generateReport } = useTriage();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 selection:bg-red-500/30">
      <Header />
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IncidentForm 
          image={image}
          setImage={setImage}
          notes={notes}
          setNotes={setNotes}
          loading={loading}
          error={error}
          onGenerateReport={generateReport}
        />
        <DashboardOutput 
          report={report}
          loading={loading}
        />
      </main>
    </div>
  );
}
