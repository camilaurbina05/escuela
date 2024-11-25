import React, { useState } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Schedule from './components/Schedule';
import Instructors from './components/Instructors';
import Students from './components/Students';
import Vehicles from './components/Vehicles';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('schedule');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <Schedule />;
      case 'instructors':
        return <Instructors />;
      case 'students':
        return <Students />;
      case 'vehicles':
        return <Vehicles />;
      default:
        return <Schedule />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      <main className="container mx-auto py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;