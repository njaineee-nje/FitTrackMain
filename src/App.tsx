import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import ActivityFeed from './components/ActivityFeed';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Athletes from './components/Athletes';
import Profile from './components/Profile';
import NotificationCenter from './components/NotificationCenter';
import { AIReminder } from './components/AIReminderSystem';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'motivation' | 'goal_check' | 'weekly_summary' | 'achievement' | 'social';
  timestamp: Date;
  isRead: boolean;
  activityType?: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleAIReminder = (aiReminder: AIReminder) => {
    const notification: Notification = {
      id: aiReminder.id,
      title: aiReminder.title,
      message: aiReminder.message,
      type: aiReminder.type,
      timestamp: aiReminder.timestamp,
      isRead: false,
      activityType: aiReminder.activityType,
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;
  
  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <ActivityFeed />;
      case 'activities':
        return (
          <Dashboard
            onSendAIReminder={handleAIReminder}
            showWeeklyReport={showWeeklyReport}
            onShowWeeklyReport={() => setShowWeeklyReport(true)}
            onCloseWeeklyReport={() => setShowWeeklyReport(false)}
          />
        );
      case 'leaderboard':
        return <Leaderboard />;
      case 'athletes':
        return <Athletes />;
      case 'profile':
        return <Profile />;
      default:
        return <ActivityFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        notificationCount={unreadNotificationCount}
        onNotificationClick={() => setIsNotificationCenterOpen(true)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      />
    </div>
  );
}

export default App;