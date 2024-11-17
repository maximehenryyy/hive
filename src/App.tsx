import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RightSidebar } from './components/RightSidebar';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Explorer } from './pages/Explorer';
import { Notifications } from './pages/Notifications';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { TopCreators } from './pages/TopCreators';
import { CreatorProfile } from './pages/CreatorProfile';

export default function App() {
  const { 
    user, 
    isDemoMode,
    initialize,
    cleanup
  } = useStore();

  useEffect(() => {
    if (typeof initialize === 'function') {
      initialize();
    }
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [initialize, cleanup]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
          <MobileNav />
        </div>

        <Header />
        
        <main className="md:ml-64 lg:mr-64 pt-16 px-4 md:px-6 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/notifications" element={user || isDemoMode ? <Notifications /> : <Login />} />
              <Route path="/messages" element={user || isDemoMode ? <Messages /> : <Login />} />
              <Route path="/profile" element={user || isDemoMode ? <Profile /> : <Login />} />
              <Route path="/settings" element={user || isDemoMode ? <Settings /> : <Login />} />
              <Route path="/top-creators" element={<TopCreators />} />
              <Route path="/creator/:username" element={<CreatorProfile />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </main>
        
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </Router>
  );
}