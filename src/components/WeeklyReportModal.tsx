import React from 'react';
import { X, Calendar, Clock, Flame, Activity, TrendingUp, Target } from 'lucide-react';

interface WeeklyActivity {
  date: string;
  type: 'run' | 'ride' | 'swim' | 'workout';
  duration: number; // in minutes
  distance?: number; // in km
  calories: number;
}

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekData: WeeklyActivity[];
  weekNumber: number;
  year: number;
}

export default function WeeklyReportModal({ 
  isOpen, 
  onClose, 
  weekData, 
  weekNumber, 
  year 
}: WeeklyReportModalProps) {
  if (!isOpen) return null;

  const totalWorkouts = weekData.length;
  const totalDuration = weekData.reduce((sum, activity) => sum + activity.duration, 0);
  const totalCalories = weekData.reduce((sum, activity) => sum + activity.calories, 0);
  const totalDistance = weekData.reduce((sum, activity) => sum + (activity.distance || 0), 0);
  
  const workoutDays = new Set(weekData.map(activity => activity.date)).size;
  const consistencyPercentage = Math.round((workoutDays / 7) * 100);

  const getActivityEmoji = (type: string) => {
    const emojiMap: { [key: string]: string } = {
      run: '🏃‍♂️',
      ride: '🚴‍♂️',
      swim: '🏊‍♂️',
      workout: '💪',
    };
    return emojiMap[type] || '🏃‍♂️';
  };

  const getConsistencyMessage = () => {
    if (workoutDays >= 6) {
      return "🔥 Amazing consistency! You're on fire! Keep this incredible momentum going next week!";
    } else if (workoutDays >= 4) {
      return "💪 Great consistency! Push for 6 days next week to reach elite level!";
    } else if (workoutDays >= 2) {
      return "👍 Good start! Aim for 4-5 workout days next week to build stronger habits!";
    } else {
      return "🎯 Every journey starts with a single step! Let's aim for 3 workout days next week!";
    }
  };

  const getPerformanceInsight = () => {
    const avgDuration = totalDuration / totalWorkouts || 0;
    const avgCalories = totalCalories / totalWorkouts || 0;
    
    if (avgDuration > 45) {
      return "🏆 Your workout intensity is impressive! You're building serious endurance.";
    } else if (avgDuration > 30) {
      return "⚡ Solid workout sessions! Consider adding 10-15 more minutes for even better results.";
    } else {
      return "🌟 Great start! Try extending your sessions to 30+ minutes for optimal benefits.";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Weekly Report</h2>
              <p className="text-white/90">Week {weekNumber}, {year}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{totalWorkouts}</p>
              <p className="text-sm text-gray-600">Workouts</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatDuration(totalDuration)}</p>
              <p className="text-sm text-gray-600">Total Time</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Flame className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{totalCalories.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Calories</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workoutDays}/7</p>
              <p className="text-sm text-gray-600">Active Days</p>
            </div>
          </div>

          {/* Consistency Progress */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Weekly Consistency</h3>
              <span className="text-2xl font-bold text-orange-600">{consistencyPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${consistencyPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700 font-medium">{getConsistencyMessage()}</p>
          </div>

          {/* Performance Insight */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">Performance Insight</h3>
            <p className="text-sm text-gray-700">{getPerformanceInsight()}</p>
          </div>

          {/* Daily Breakdown */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Daily Breakdown</h3>
            {weekData.length > 0 ? (
              <div className="space-y-3">
                {weekData.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getActivityEmoji(activity.type)}</span>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{activity.type}</p>
                        <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatDuration(activity.duration)}</p>
                      <p className="text-sm text-gray-600">{activity.calories} cal</p>
                      {activity.distance && (
                        <p className="text-xs text-gray-500">{activity.distance} km</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No activities recorded this week</p>
                <p className="text-sm">Start your fitness journey today!</p>
              </div>
            )}
          </div>

          {/* Next Week Goals */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Next Week Goals</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700">🎯 Target: <span className="font-medium">{Math.max(workoutDays + 1, 5)} workout days</span></p>
                <p className="text-gray-700">⏱️ Duration: <span className="font-medium">{Math.max(totalDuration + 60, 300)} minutes total</span></p>
              </div>
              <div>
                <p className="text-gray-700">🔥 Calories: <span className="font-medium">{Math.max(totalCalories + 500, 2000)} calories</span></p>
                <p className="text-gray-700">📈 Consistency: <span className="font-medium">Beat {consistencyPercentage}%</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-colors"
          >
            Continue Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}