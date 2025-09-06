import React, { useEffect, useState } from 'react';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { emailService, WeeklyEmailData } from '../services/emailService';

interface WeeklyEmailSchedulerProps {
  userEmail: string;
  userName: string;
  weeklyActivities: Array<{
    date: string;
    type: 'run' | 'ride' | 'swim' | 'workout';
    duration: number;
    distance?: number;
    calories: number;
  }>;
}

export default function WeeklyEmailScheduler({ 
  userEmail, 
  userName, 
  weeklyActivities 
}: WeeklyEmailSchedulerProps) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [lastSentDate, setLastSentDate] = useState<string | null>(
    localStorage.getItem('lastWeeklyEmailSent')
  );

  const shouldSendWeeklyEmail = (): boolean => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const currentWeekKey = `${now.getFullYear()}-W${getWeekNumber(now)}`;
    
    // Send on Sunday evening (day 0) and only once per week
    return dayOfWeek === 0 && lastSentDate !== currentWeekKey;
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const sendWeeklyEmail = async () => {
    if (!userEmail || emailStatus === 'sending') return;

    setEmailStatus('sending');

    const now = new Date();
    const weekNumber = getWeekNumber(now);
    const year = now.getFullYear();
    
    const totalWorkouts = weeklyActivities.length;
    const totalDuration = weeklyActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const totalCalories = weeklyActivities.reduce((sum, activity) => sum + activity.calories, 0);
    const workoutDays = new Set(weeklyActivities.map(activity => activity.date)).size;
    const consistencyPercentage = Math.round((workoutDays / 7) * 100);

    const emailData: WeeklyEmailData = {
      userEmail,
      userName,
      weekNumber,
      year,
      totalWorkouts,
      totalDuration,
      totalCalories,
      workoutDays,
      consistencyPercentage,
      activities: weeklyActivities,
    };

    try {
      const success = await emailService.sendWeeklySummary(emailData);
      
      if (success) {
        setEmailStatus('sent');
        const weekKey = `${year}-W${weekNumber}`;
        setLastSentDate(weekKey);
        localStorage.setItem('lastWeeklyEmailSent', weekKey);
      } else {
        setEmailStatus('error');
      }
    } catch (error) {
      console.error('Error sending weekly email:', error);
      setEmailStatus('error');
    }

    // Reset status after 5 seconds
    setTimeout(() => setEmailStatus('idle'), 5000);
  };

  // Check and send email automatically
  useEffect(() => {
    const checkAndSendEmail = () => {
      if (shouldSendWeeklyEmail()) {
        sendWeeklyEmail();
      }
    };

    // Check immediately
    checkAndSendEmail();

    // Check every hour
    const interval = setInterval(checkAndSendEmail, 3600000);

    return () => clearInterval(interval);
  }, [userEmail, weeklyActivities, lastSentDate]);

  const getStatusIcon = () => {
    switch (emailStatus) {
      case 'sending':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (emailStatus) {
      case 'sending':
        return 'Sending weekly summary...';
      case 'sent':
        return 'Weekly summary sent successfully!';
      case 'error':
        return 'Failed to send weekly summary';
      default:
        return 'Weekly email summary enabled';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="font-medium text-gray-900">Weekly Email Summary</h4>
            <p className="text-sm text-gray-600">{getStatusMessage()}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Sent to:</p>
          <p className="text-sm font-medium text-gray-900">{userEmail}</p>
          {lastSentDate && (
            <p className="text-xs text-gray-500">Last sent: {lastSentDate}</p>
          )}
        </div>
      </div>

      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          📧 You'll receive a detailed weekly summary every Sunday evening with your workout stats, 
          consistency analysis, and personalized goals for the next week.
        </p>
      </div>

      {emailStatus === 'error' && (
        <div className="mt-3">
          <button
            onClick={sendWeeklyEmail}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Retry sending email
          </button>
        </div>
      )}
    </div>
  );
}