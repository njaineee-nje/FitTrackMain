import React from 'react';
import { Clock, Bell, BellOff, Edit3, Trash2 } from 'lucide-react';
import { ReminderData } from './ReminderModal';

interface ReminderListProps {
  reminders: ReminderData[];
  onToggleReminder: (id: string) => void;
  onEditReminder: (reminder: ReminderData) => void;
  onDeleteReminder: (id: string) => void;
}

export default function ReminderList({ 
  reminders, 
  onToggleReminder, 
  onEditReminder, 
  onDeleteReminder 
}: ReminderListProps) {
  const getActivityEmoji = (type: string) => {
    const emojiMap: { [key: string]: string } = {
      run: '🏃‍♂️',
      ride: '🚴‍♂️',
      swim: '🏊‍♂️',
      workout: '💪',
      yoga: '🧘‍♀️',
      walk: '🚶‍♂️',
    };
    return emojiMap[type] || '🏃‍♂️';
  };

  const formatDays = (days: string[]) => {
    const dayMap: { [key: string]: string } = {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
    };
    return days.map(day => dayMap[day]).join(', ');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders set</h3>
        <p className="text-gray-600">Create your first activity reminder to stay on track with your fitness goals.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Reminders</h2>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-4 rounded-lg border transition-all ${
              reminder.isActive
                ? 'border-orange-200 bg-orange-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getActivityEmoji(reminder.activityType)}</div>
                <div>
                  <h3 className={`font-semibold ${
                    reminder.isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {reminder.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(reminder.time)}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDays(reminder.days)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleReminder(reminder.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    reminder.isActive
                      ? 'text-orange-600 hover:bg-orange-100'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={reminder.isActive ? 'Disable reminder' : 'Enable reminder'}
                >
                  {reminder.isActive ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => onEditReminder(reminder)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit reminder"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteReminder(reminder.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete reminder"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}