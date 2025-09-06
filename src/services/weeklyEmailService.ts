import { userService } from './userService';
import { activityService } from './activityService';
import { User, UserActivity } from '../lib/supabase';

interface WeeklyReportData {
  user: User;
  activities: UserActivity[];
  stats: {
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    totalDistance: number;
    workoutDays: number;
    consistencyPercentage: number;
  };
  aiInsights: {
    consistencyInsight: string;
    performanceInsight: string;
    motivationalMessage: string;
    weeklyScore: number;
  };
}

class WeeklyEmailService {
  private getWeekStartDate(): string {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek; // If Sunday, start from today, else go back to last Sunday
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSubtract);
    return weekStart.toISOString().split('T')[0];
  }

  private generateAIInsights(activities: UserActivity[], stats: any) {
    const { totalWorkouts, totalDuration, totalCalories, workoutDays } = stats;
    const avgDuration = totalDuration / totalWorkouts || 0;

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

    const weeklyScore = Math.min(100, (workoutDays * 15) + (totalDuration / 10) + (totalCalories / 50));

    return {
      consistencyInsight,
      performanceInsight,
      motivationalMessage,
      weeklyScore
    };
  }

  private async sendEmailToUser(reportData: WeeklyReportData): Promise<boolean> {
    try {
      // In a real app, you would use a service like EmailJS, SendGrid, or Resend
      // For now, we'll simulate the email sending and log the data
      
      console.log('📧 WEEKLY EMAIL REPORT 📧');
      console.log('='.repeat(50));
      console.log(`To: ${reportData.user.email}`);
      console.log(`Name: ${reportData.user.full_name}`);
      console.log('='.repeat(50));
      console.log('📊 WEEKLY STATS:');
      console.log(`• Total Workouts: ${reportData.stats.totalWorkouts}`);
      console.log(`• Total Duration: ${Math.floor(reportData.stats.totalDuration / 60)}h ${reportData.stats.totalDuration % 60}m`);
      console.log(`• Total Calories: ${reportData.stats.totalCalories.toLocaleString()}`);
      console.log(`• Total Distance: ${reportData.stats.totalDistance.toFixed(1)} km`);
      console.log(`• Workout Days: ${reportData.stats.workoutDays}/7`);
      console.log(`• Consistency: ${reportData.stats.consistencyPercentage}%`);
      console.log('='.repeat(50));
      console.log('🤖 AI INSIGHTS:');
      console.log(`• Consistency: ${reportData.aiInsights.consistencyInsight}`);
      console.log(`• Performance: ${reportData.aiInsights.performanceInsight}`);
      console.log(`• Motivation: ${reportData.aiInsights.motivationalMessage}`);
      console.log(`• Weekly Score: ${Math.round(reportData.aiInsights.weeklyScore)}/100`);
      console.log('='.repeat(50));
      console.log('📅 ACTIVITIES THIS WEEK:');
      reportData.activities.forEach(activity => {
        const date = new Date(activity.activity_date).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
        console.log(`• ${activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)} on ${date}: ${activity.duration}min${activity.distance ? ` - ${activity.distance}km` : ''} (${activity.calories} cal)`);
      });
      console.log('='.repeat(50));
      
      // Simulate email API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending weekly email:', error);
      return false;
    }
  }

  async sendWeeklyReportsToAllUsers(): Promise<void> {
    try {
      console.log('🚀 Starting weekly email report generation...');
      
      // Get all users who want weekly reports
      const users = await userService.getAllUsersWithWeeklyReports();
      console.log(`📋 Found ${users.length} users subscribed to weekly reports`);
      
      if (users.length === 0) {
        console.log('ℹ️ No users found for weekly reports');
        return;
      }

      const weekStart = this.getWeekStartDate();
      console.log(`📅 Generating reports for week starting: ${weekStart}`);

      for (const user of users) {
        try {
          console.log(`\n👤 Processing user: ${user.full_name} (${user.email})`);
          
          // Get user's weekly activities
          const activities = await activityService.getWeeklyActivities(user.id, weekStart);
          
          // Calculate stats
          const totalWorkouts = activities.length;
          const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
          const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
          const totalDistance = activities.reduce((sum, activity) => sum + (activity.distance || 0), 0);
          const workoutDays = new Set(activities.map(activity => activity.activity_date)).size;
          const consistencyPercentage = Math.round((workoutDays / 7) * 100);

          const stats = {
            totalWorkouts,
            totalDuration,
            totalCalories,
            totalDistance,
            workoutDays,
            consistencyPercentage
          };

          // Generate AI insights
          const aiInsights = this.generateAIInsights(activities, stats);

          // Prepare report data
          const reportData: WeeklyReportData = {
            user,
            activities,
            stats,
            aiInsights
          };

          // Send email
          const emailSent = await this.sendEmailToUser(reportData);
          
          if (emailSent) {
            console.log(`✅ Weekly report sent successfully to ${user.email}`);
          } else {
            console.log(`❌ Failed to send weekly report to ${user.email}`);
          }
          
        } catch (error) {
          console.error(`❌ Error processing user ${user.email}:`, error);
        }
      }
      
      console.log('\n🎉 Weekly email report generation completed!');
      
    } catch (error) {
      console.error('❌ Error in weekly email service:', error);
    }
  }

  // Method to manually trigger weekly reports (for testing)
  async triggerWeeklyReports(): Promise<void> {
    console.log('🧪 Manually triggering weekly reports...');
    await this.sendWeeklyReportsToAllUsers();
  }
}

export const weeklyEmailService = new WeeklyEmailService();