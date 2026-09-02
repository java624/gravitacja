import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackgroundGlow from './components/layout/BackgroundGlow';
import HomePage from './pages/HomePage';
import KatowicePage from './pages/KatowicePage';
import JaworznoPage from './pages/JaworznoPage';
import PoznanPage from './pages/PoznanPage';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const renderActivePage = () => {
    switch (selectedCity) {
      case 'katowice':
        return <KatowicePage />;
      case 'jaworzno':
        return <JaworznoPage />;
      case 'poznan':
        return <PoznanPage />;
      default:
        return <HomePage onSelectCity={setSelectedCity} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020308] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black cursor-none">
      {/* Dynamic WebGL & Ambient Neon Backdrop */}
      <BackgroundGlow />

      {/* Main Navigation Header */}
      <Header selectedCity={selectedCity} onSelectCity={setSelectedCity} />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {renderActivePage()}
      </main>

      {/* Global 4-Column Footer */}
      <Footer onSelectCity={setSelectedCity} />
    </div>
  );
}