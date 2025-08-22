import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-dark text-gray-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Demonstration dashboard for Corrosion, the composable toolkit with a Rust core, powered by the Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;