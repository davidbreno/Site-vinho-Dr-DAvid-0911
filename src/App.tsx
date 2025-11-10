import { useState } from "react";
import type { Patient } from './types/patient';
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Patients } from "./components/Patients";
import { Appointments } from "./components/Appointments";
import { Treatments } from "./components/Treatments";
import { Reports } from "./components/Reports";
import { Schedule } from "./components/Schedule";
import { Billing } from "./components/Billing";
import { Documents } from "./components/Documents";
import { Settings } from "./components/Settings";
import { PatientRecordPage } from "./components/PatientRecordPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewingPatientRecord, setViewingPatientRecord] = useState(false);

  const handleViewPatientRecord = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewingPatientRecord(true);
  };

  const handleBackToPatients = () => {
    setViewingPatientRecord(false);
    setSelectedPatient(null);
    setActiveTab("patients");
  };

  if (viewingPatientRecord && selectedPatient) {
    return <PatientRecordPage patient={selectedPatient} onBack={handleBackToPatients} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "patients":
        return <Patients onViewPatientRecord={handleViewPatientRecord} />;
      case "appointments":
        return <Appointments />;
      case "treatments":
        return <Treatments />;
      case "reports":
        return <Reports />;
      case "schedule":
        return <Schedule />;
      case "billing":
        return <Billing />;
      case "documents":
        return <Documents />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden relative">
      {/* Textura de Mármore no Fundo */}
      <div 
        className="absolute inset-0 opacity-[0.25] pointer-events-none z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1hcmJsZSUyMHRleHR1cmV8ZW58MXx8fHwxNzYyNjA1OTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto relative z-10">
        {renderContent()}
      </main>
    </div>
  );
}