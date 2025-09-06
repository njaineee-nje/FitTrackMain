import React, { useState } from 'react';
import { X, Clock, Calendar, Bell, Repeat } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: ReminderData) => void;
}

export interface ReminderData {
  id: string;
  title: string;
  activityType: string;
  time: string;
  days: string[];
  isActive: boolean;
  createdAt: Date;
}

export default function ReminderModal({ isOpen, onClose, onSave }: ReminderModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    activityType: 'run',
    time: '07:00',
    days: [] as string[],
  });

  const activityTypes = [
    { value: 'run', label: 'Running', emoji: '🏃‍♂️' },
    { value: 'ride', label: 'Cycling', emoji: '🚴‍♂️' },
    { value: 'swim', label: 'Swimming', emoji: '🏊‍♂️' },
    { value: 'workout', label: 'Workout', emoji: '💪' },
    { value: 'yoga', label: 'Yoga', emoji: '🧘‍♀️' },
    { value: 'walk', label: 'Walking', emoji: '🚶‍♂️' },
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ];

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.days.length > 0) {
      const reminder: ReminderData = {
        id: Date.now().toString(),
        title: formData.title,
        activityType: formData.activityType,
        time: formData.time,
        days: formData.days,
        isActive: true,
        createdAt: new Date(),
      };
      onSave(reminder);
      setFormData({ title: '', activityType: 'run', time: '07:00', days: [] });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Set Activity Reminder</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Morning Run"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activityTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, activityType: type.value }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center space-x-2 ${
                    formData.activityType === type.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Reminder Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Repeat className="w-4 h-4 inline mr-1" />
              Repeat on Days
            </label>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.days.includes(day.value)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {formData.days.length === 0 && (
              <p className="text-sm text-red-600 mt-1">Please select at least one day</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Set Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}