import React from 'react';
import { Stethoscope, Home, FileText, Users, Settings, Bell } from 'lucide-react';
import TranscriptionPanel from './components/TranscriptionPanel';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Daisy Medic Portal</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TranscriptionPanel />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-3">
            <NavButton icon={<Home />} label="Home" active />
            <NavButton icon={<FileText />} label="Records" />
            <NavButton icon={<Users />} label="Patients" />
            <NavButton icon={<Bell />} label="Alerts" />
            <NavButton icon={<Settings />} label="Settings" />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button 
      className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
        active ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default App;