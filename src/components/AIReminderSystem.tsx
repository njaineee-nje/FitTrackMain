import React, { useState, useEffect } from 'react';
import { Brain, Target, Calendar, TrendingUp, Clock, BarChart3 } from 'lucide-react';

interface WeeklyGoal {
  activityType: string;
  targetDistance: number;
  targetSessions: number;
  currentDistance: number;
  currentSessions: number;
}

export interface WeeklyActivity {
  date: string;
  type: 'run' | 'ride' | 'swim' | 'workout';
  duration: number; // in minutes
  distance?: number; // in km
  calories: number;
}

interface AIReminderSystemProps {
  onSendReminder: (reminder: AIReminder) => void;
  onShowWeeklyReport: () => void;
}

export interface AIReminder {
  id: string;
  title: string;
  message: string;
  type: 'motivation' | 'goal_check' | 'weekly_summary';
  timestamp: Date;
  activityType?: string;
}

export default function AIReminderSystem({ onSendReminder, onShowWeeklyReport }: AIReminderSystemProps) {
  const [weeklyGoals] = useState<WeeklyGoal[]>([
    {
      activityType: 'running',
      targetDistance: 25,
      targetSessions: 3,
      currentDistance: 18.5,
      currentSessions: 2,
    },
    {
      activityType: 'cycling',
      targetDistance: 50,
      targetSessions: 2,
      currentDistance: 32,
      currentSessions: 1,
    },
  ]);

  // Sample weekly activity data
  const [weeklyActivities] = useState<WeeklyActivity[]>([
    { date: '2025-01-13', type: 'run', duration: 45, distance: 8.2, calories: 420 },
    { date: '2025-01-14', type: 'workout', duration: 30, calories: 280 },
    { date: '2025-01-15', type: 'ride', duration: 60, distance: 15.7, calories: 480 },
    { date: '2025-01-16', type: 'run', duration: 35, distance: 6.1, calories: 350 },
    { date: '2025-01-18', type: 'swim', duration: 40, distance: 2.1, calories: 320 },
  ]);

  const generateMotivationalMessage = (goal: WeeklyGoal): string => {
    const distanceProgress = (goal.currentDistance / goal.targetDistance) * 100;
    const sessionProgress = (goal.currentSessions / goal.targetSessions) * 100;
    
    if (distanceProgress < 30) {
      return `Time to lace up! You're just getting started with your ${goal.activityType} goal. Every step counts! 🏃‍♂️`;
    } else if (distanceProgress < 70) {
      return `Great progress on your ${goal.activityType}! You're ${distanceProgress.toFixed(0)}% there. Keep the momentum going! 💪`;
    } else if (distanceProgress < 100) {
      return `So close to your ${goal.activityType} goal! Just ${(goal.targetDistance - goal.currentDistance).toFixed(1)}km to go. You've got this! 🎯`;
    } else {
      return `Amazing! You've crushed your ${goal.activityType} goal this week! Time to celebrate and set new challenges! 🏆`;
    }
  };

  const generateReminderTitle = (goal: WeeklyGoal): string => {
    const progress = (goal.currentDistance / goal.targetDistance) * 100;
    
    if (progress < 50) {
      return `AI Coach: Time for ${goal.activityType}!`;
    } else if (progress < 90) {
      return `AI Coach: Almost there with ${goal.activityType}!`;
    } else {
      return `AI Coach: Final push for ${goal.activityType}!`;
    }
  };

  const sendAIReminder = (goal: WeeklyGoal, type: AIReminder['type'] = 'motivation') => {
    const reminder: AIReminder = {
      id: `ai-${Date.now()}-${Math.random()}`,
      title: generateReminderTitle(goal),
      message: generateMotivationalMessage(goal),
      type,
      timestamp: new Date(),
      activityType: goal.activityType,
    };
    
    onSendReminder(reminder);
  };

  // AI reminder logic - sends reminders based on user's progress and patterns
  useEffect(() => {
    const checkAndSendReminders = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = now.getHours();
      
      // Send morning motivation (8 AM on weekdays)
      if (hour === 8 && dayOfWeek >= 1 && dayOfWeek <= 5) {
        weeklyGoals.forEach(goal => {
          const progress = (goal.currentDistance / goal.targetDistance) * 100;
          if (progress < 80) { // Only send if not close to completion
            setTimeout(() => sendAIReminder(goal, 'motivation'), Math.random() * 30000); // Random delay up to 30 seconds
          }
        });
      }
      
      // Send mid-week check (Wednesday 6 PM)
      if (dayOfWeek === 3 && hour === 18) {
        weeklyGoals.forEach(goal => {
          setTimeout(() => sendAIReminder(goal, 'goal_check'), Math.random() * 60000);
        });
      }
      
      // Send weekend summary (Sunday 7 PM)
      if (dayOfWeek === 0 && hour === 19) {
        // Calculate weekly stats for the summary message
        const totalWorkouts = weeklyActivities.length;
        const totalDuration = weeklyActivities.reduce((sum, activity) => sum + activity.duration, 0);
        const totalCalories = weeklyActivities.reduce((sum, activity) => sum + activity.calories, 0);
        const workoutDays = new Set(weeklyActivities.map(activity => activity.date)).size;
        
        const consistencyMessage = workoutDays >= 6 
          ? "Amazing consistency! Push for 6 days next week!" 
          : workoutDays >= 4 
          ? "Great consistency! Push for 6 days next week to reach elite level!"
          : "Good progress! Aim for more consistency next week!";
        
        const summaryMessage = `Week complete! 💪 ${totalWorkouts} workouts, ${Math.floor(totalDuration/60)}h ${totalDuration%60}m total, ${totalCalories} calories burned. ${consistencyMessage}`;
        
        const summaryReminder: AIReminder = {
          id: `ai-summary-${Date.now()}`,
          title: 'AI Coach: Weekly Summary',
          message: summaryMessage,
          type: 'weekly_summary',
          timestamp: new Date(),
        };
        onSendReminder(summaryReminder);
      }
    };

    // Check every hour
    const interval = setInterval(checkAndSendReminders, 3600000);
    
    // Also check immediately (for demo purposes)
    setTimeout(checkAndSendReminders, 2000);
    
    return () => clearInterval(interval);
  }, [weeklyGoals, onSendReminder]);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Fitness Coach</h3>
          <p className="text-white/80 text-sm">Personalized reminders based on your goals</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {weeklyGoals.map((goal, index) => {
          const distanceProgress = (goal.currentDistance / goal.targetDistance) * 100;
          const sessionProgress = (goal.currentSessions / goal.targetSessions) * 100;
          
          return (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">{goal.activityType}</h4>
                <span className="text-sm text-white/80">
                  {goal.currentSessions}/{goal.targetSessions} sessions
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.currentDistance}km</span>
                  <span>{goal.targetDistance}km</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(distanceProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs text-white/80">
                AI will remind you based on your progress and optimal training times
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4" />
          <span>Next AI reminder: Based on your activity patterns</span>
          </div>
          <button
            onClick={onShowWeeklyReport}
            className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Weekly Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}