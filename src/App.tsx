import React, { useState } from 'react';
import { useEffect } from 'react';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import ActivityFeed from './components/ActivityFeed';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Athletes from './components/Athletes';
import Profile from './components/Profile';
import ReminderModal, { ReminderData } from './components/ReminderModal';
import NotificationCenter from './components/NotificationCenter';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'social';
  timestamp: Date;
  isRead: boolean;
  activityType?: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [reminders, setReminders] = useState<ReminderData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderData | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSaveReminder = (reminderData: ReminderData) => {
    if (editingReminder) {
      setReminders(prev => prev.map(r => r.id === editingReminder.id ? reminderData : r));
      setEditingReminder(null);
    } else {
      setReminders(prev => [...prev, reminderData]);
    }
    
    // Add a confirmation notification
    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Reminder Set',
      message: `Your ${reminderData.title} reminder has been set for ${reminderData.time}`,
      type: 'reminder',
      timestamp: new Date(),
      isRead: false,
      activityType: reminderData.activityType,
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const handleEditReminder = (reminder: ReminderData) => {
    setEditingReminder(reminder);
    setIsReminderModalOpen(true);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Check for reminder notifications
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDay = dayNames[now.getDay()];

      reminders.forEach(reminder => {
        if (reminder.isActive && 
            reminder.time === currentTime && 
            reminder.days.includes(currentDay)) {
          
          const notification: Notification = {
            id: `reminder-${reminder.id}-${Date.now()}`,
            title: 'Time to Exercise!',
            message: `It's time for your ${reminder.title}`,
            type: 'reminder',
            timestamp: new Date(),
            isRead: false,
            activityType: reminder.activityType,
          };
          
          setNotifications(prev => [notification, ...prev]);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

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
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminder}
            onAddReminder={() => setIsReminderModalOpen(true)}
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
      
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setEditingReminder(null);
        }}
        onSave={handleSaveReminder}
      />
      
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