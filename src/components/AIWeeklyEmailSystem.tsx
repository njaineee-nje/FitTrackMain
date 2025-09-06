import React, { useEffect, useState } from 'react';
import { Mail, Clock, CheckCircle, AlertCircle, Brain, Zap } from 'lucide-react';
import { emailService, WeeklyEmailData } from '../services/emailService';

interface AIWeeklyEmailSystemProps {
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

export default function AIWeeklyEmailSystem({ 
  userEmail, 
  userName, 
  weeklyActivities 
}: AIWeeklyEmailSystemProps) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'analyzing' | 'sending' | 'sent' | 'error'>('idle');
  const [lastSentDate, setLastSentDate] = useState<string | null>(
    localStorage.getItem('lastAIWeeklyEmailSent')
  );
  const [nextEmailTime, setNextEmailTime] = useState<string>('');

  const calculateNextSundayEvening = (): Date => {
    const now = new Date();
    const nextSunday = new Date(now);
    const daysUntilSunday = (7 - now.getDay()) % 7;
    
    if (daysUntilSunday === 0 && now.getHours() < 19) {
      // It's Sunday and before 7 PM, send today
      nextSunday.setHours(19, 0, 0, 0);
    } else {
      // Set to next Sunday at 7 PM
      nextSunday.setDate(now.getDate() + (daysUntilSunday || 7));
      nextSunday.setHours(19, 0, 0, 0);
    }
    
    return nextSunday;
  };

  const shouldSendWeeklyEmail = (): boolean => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const hour = now.getHours();
    const currentWeekKey = `${now.getFullYear()}-W${getWeekNumber(now)}`;
    
    // Send on Sunday evening (day 0, hour 19) and only once per week
    return dayOfWeek === 0 && hour >= 19 && lastSentDate !== currentWeekKey;
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const generateAIInsights = (activities: typeof weeklyActivities) => {
    const totalWorkouts = activities.length;
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
    const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
    const workoutDays = new Set(activities.map(activity => activity.date)).size;
    const avgDuration = totalDuration / totalWorkouts || 0;

    // AI-generated insights
    const consistencyInsight = workoutDays >= 6 
      ? "🔥 Amazing consistency! You're absolutely crushing it! Your dedication is inspiring!"
      : workoutDays >= 4 
      ? "💪 Great consistency! Push for 6 days next week to reach elite athlete level!"
      : workoutDays >= 2
      ? "👍 Good foundation! Aim for 4-5 workout days next week to build unstoppable momentum!"
      : "🎯 Every champion starts somewhere! Let's target 3 solid workout days next week!";

    const performanceInsight = avgDuration > 45
      ? "🏆 Your workout intensity is phenomenal! You're building serious athletic endurance."
      : avgDuration > 30
      ? "⚡ Solid training sessions! Consider adding 10-15 more minutes for explosive results."
      : "🌟 Great start! Extend to 30+ minutes per session to unlock your full potential.";

    const motivationalMessage = totalCalories > 2000
      ? "🔥 You torched over 2000 calories this week! Your metabolism is thanking you!"
      : totalCalories > 1000
      ? "💪 Great calorie burn! Push past 2000 next week for maximum fat-burning benefits!"
      : "🎯 Every calorie burned counts! Aim for 1500+ calories next week to accelerate results!";

    return {
      consistencyInsight,
      performanceInsight,
      motivationalMessage,
      weeklyScore: Math.min(100, (workoutDays * 15) + (totalDuration / 10) + (totalCalories / 50))
    };
  };

  const sendAIWeeklyEmail = async () => {
    if (!userEmail || emailStatus === 'sending' || emailStatus === 'analyzing') return;

    setEmailStatus('analyzing');
    
    // Simulate AI analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setEmailStatus('sending');

    const now = new Date();
    const weekNumber = getWeekNumber(now);
    const year = now.getFullYear();
    
    const totalWorkouts = weeklyActivities.length;
    const totalDuration = weeklyActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const totalCalories = weeklyActivities.reduce((sum, activity) => sum + activity.calories, 0);
    const workoutDays = new Set(weeklyActivities.map(activity => activity.date)).size;
    const consistencyPercentage = Math.round((workoutDays / 7) * 100);

    const aiInsights = generateAIInsights(weeklyActivities);

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
      aiInsights
    };

    try {
      const success = await emailService.sendAIWeeklySummary(emailData);
      
      if (success) {
        setEmailStatus('sent');
        const weekKey = `${year}-W${weekNumber}`;
        setLastSentDate(weekKey);
        localStorage.setItem('lastAIWeeklyEmailSent', weekKey);
      } else {
        setEmailStatus('error');
      }
    } catch (error) {
      console.error('Error sending AI weekly email:', error);
      setEmailStatus('error');
    }

    // Reset status after 10 seconds
    setTimeout(() => setEmailStatus('idle'), 10000);
  };

  // Update next email time
  useEffect(() => {
    const updateNextEmailTime = () => {
      const nextSunday = calculateNextSundayEvening();
      const now = new Date();
      const timeDiff = nextSunday.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
          setNextEmailTime(`in ${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours > 1 ? 's' : ''}`);
        } else {
          setNextEmailTime(`in ${hours} hour${hours > 1 ? 's' : ''}`);
        }
      } else {
        setNextEmailTime('soon');
      }
    };

    updateNextEmailTime();
    const interval = setInterval(updateNextEmailTime, 60000); // Update every minute
      if (shouldSendWeeklyEmail()) {
        sendAIWeeklyEmail();
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
      case 'analyzing':
        return <Brain className="w-5 h-5 text-purple-600 animate-pulse" />;
      case 'sending':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Mail className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (emailStatus) {
      case 'analyzing':
        return 'AI analyzing your weekly performance...';
      case 'sending':
        return 'Sending personalized weekly summary...';
      case 'sent':
        return 'AI weekly summary sent successfully!';
      case 'error':
        return 'Failed to send AI weekly summary';
      default:
        return 'AI Weekly Email Intelligence Active';
    }
  };

  const aiInsights = generateAIInsights(weeklyActivities);

  return (
    <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 rounded-xl text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Email Intelligence</h3>
            <p className="text-white/80 text-sm">Automated weekly insights delivered to your inbox</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusMessage()}</span>
          </div>
          <p className="text-xs text-white/70">Next email: {nextEmailTime}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Email Recipient</h4>
            <Mail className="w-5 h-5 text-white/70" />
          </div>
          <p className="text-white/90 font-medium">{userName}</p>
          <p className="text-white/70 text-sm">{userEmail}</p>
          {lastSentDate && (
            <p className="text-xs text-white/60 mt-2">Last sent: {lastSentDate}</p>
          )}
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">AI Performance Score</h4>
            <Zap className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold">{Math.round(aiInsights.weeklyScore)}/100</div>
            <div className="flex-1">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${aiInsights.weeklyScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center space-x-2">
          <span>🤖</span>
          <span>AI Weekly Insights Preview</span>
        </h4>
        <div className="space-y-2 text-sm">
          <p className="text-white/90">📊 {aiInsights.consistencyInsight}</p>
          <p className="text-white/90">⚡ {aiInsights.performanceInsight}</p>
          <p className="text-white/90">🔥 {aiInsights.motivationalMessage}</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Automated every Sunday at 7:00 PM</span>
          </div>
          {emailStatus === 'error' && (
            <button
              onClick={sendAIWeeklyEmail}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
            >
              Retry AI Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}