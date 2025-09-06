interface WeeklyEmailData {
  userEmail: string;
  userName: string;
  weekNumber: number;
  year: number;
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  workoutDays: number;
  consistencyPercentage: number;
  activities: Array<{
    date: string;
    type: string;
    duration: number;
    distance?: number;
    calories: number;
  }>;
  aiInsights?: {
    consistencyInsight: string;
    performanceInsight: string;
    motivationalMessage: string;
    weeklyScore: number;
  };
}

class EmailService {
  private apiEndpoint = 'https://api.emailjs.com/api/v1.0/email/send';
  private serviceId = 'your_service_id'; // Replace with your EmailJS service ID
  private templateId = 'weekly_summary_template'; // Replace with your template ID
  private publicKey = 'your_public_key'; // Replace with your EmailJS public key

  async sendAIWeeklySummary(data: WeeklyEmailData): Promise<boolean> {
    try {
      const emailData = {
        service_id: this.serviceId,
        template_id: 'ai_weekly_summary_template', // AI-specific template
        user_id: this.publicKey,
        template_params: {
          to_email: data.userEmail,
          to_name: data.userName,
          week_number: data.weekNumber,
          year: data.year,
          total_workouts: data.totalWorkouts,
          total_duration: this.formatDuration(data.totalDuration),
          total_calories: data.totalCalories.toLocaleString(),
          workout_days: data.workoutDays,
          consistency_percentage: data.consistencyPercentage,
          weekly_score: data.aiInsights?.weeklyScore || 0,
          ai_consistency_insight: data.aiInsights?.consistencyInsight || '',
          ai_performance_insight: data.aiInsights?.performanceInsight || '',
          ai_motivational_message: data.aiInsights?.motivationalMessage || '',
          activities_list: this.formatActivitiesList(data.activities),
          next_week_goals: this.generateAINextWeekGoals(data),
          email_subject: `🤖 AI Weekly Summary: ${data.consistencyPercentage}% Consistency - Week ${data.weekNumber}`,
        }
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send AI weekly summary email:', error);
      return false;
    }
  }

  async sendWeeklySummary(data: WeeklyEmailData): Promise<boolean> {
    try {
      const emailData = {
        service_id: this.serviceId,
        template_id: this.templateId,
        user_id: this.publicKey,
        template_params: {
          to_email: data.userEmail,
          to_name: data.userName,
          week_number: data.weekNumber,
          year: data.year,
          total_workouts: data.totalWorkouts,
          total_duration: this.formatDuration(data.totalDuration),
          total_calories: data.totalCalories.toLocaleString(),
          workout_days: data.workoutDays,
          consistency_percentage: data.consistencyPercentage,
          consistency_message: this.getConsistencyMessage(data.workoutDays),
          performance_insight: this.getPerformanceInsight(data.totalDuration, data.totalWorkouts),
          activities_list: this.formatActivitiesList(data.activities),
          next_week_goals: this.generateNextWeekGoals(data),
        }
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send weekly summary email:', error);
      return false;
    }
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  private getConsistencyMessage(workoutDays: number): string {
    if (workoutDays >= 6) {
      return "🔥 Amazing consistency! You're on fire! Keep this incredible momentum going next week!";
    } else if (workoutDays >= 4) {
      return "💪 Great consistency! Push for 6 days next week to reach elite level!";
    } else if (workoutDays >= 2) {
      return "👍 Good start! Aim for 4-5 workout days next week to build stronger habits!";
    } else {
      return "🎯 Every journey starts with a single step! Let's aim for 3 workout days next week!";
    }
  }

  private getPerformanceInsight(totalDuration: number, totalWorkouts: number): string {
    const avgDuration = totalDuration / totalWorkouts || 0;
    
    if (avgDuration > 45) {
      return "🏆 Your workout intensity is impressive! You're building serious endurance.";
    } else if (avgDuration > 30) {
      return "⚡ Solid workout sessions! Consider adding 10-15 more minutes for even better results.";
    } else {
      return "🌟 Great start! Try extending your sessions to 30+ minutes for optimal benefits.";
    }
  }

  private formatActivitiesList(activities: WeeklyEmailData['activities']): string {
    return activities.map(activity => {
      const date = new Date(activity.date).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      const duration = this.formatDuration(activity.duration);
      const distance = activity.distance ? ` - ${activity.distance}km` : '';
      return `• ${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} on ${date}: ${duration}${distance} (${activity.calories} cal)`;
    }).join('\n');
  }

  private generateNextWeekGoals(data: WeeklyEmailData): string {
    const targetDays = Math.max(data.workoutDays + 1, 5);
    const targetDuration = Math.max(data.totalDuration + 60, 300);
    const targetCalories = Math.max(data.totalCalories + 500, 2000);
    
    return `🎯 Target: ${targetDays} workout days
⏱️ Duration: ${this.formatDuration(targetDuration)} total
🔥 Calories: ${targetCalories.toLocaleString()} calories
📈 Consistency: Beat ${data.consistencyPercentage}%`;
  }

  private generateAINextWeekGoals(data: WeeklyEmailData): string {
    const targetDays = Math.min(7, Math.max(data.workoutDays + 1, 5));
    const targetDuration = Math.max(data.totalDuration + 90, 350); // More ambitious AI goals
    const targetCalories = Math.max(data.totalCalories + 750, 2500);
    const targetScore = Math.min(100, (data.aiInsights?.weeklyScore || 0) + 15);
    
    return `🎯 AI Recommended Targets:
📅 Workout Days: ${targetDays} days (consistency is key!)
⏱️ Total Duration: ${this.formatDuration(targetDuration)} 
🔥 Calories: ${targetCalories.toLocaleString()} calories
🏆 Performance Score: ${Math.round(targetScore)}/100
💪 Focus: ${this.getAIFocusArea(data)}`;
  }

  private getAIFocusArea(data: WeeklyEmailData): string {
    const avgDuration = data.totalDuration / data.totalWorkouts || 0;
    const consistencyPercentage = data.consistencyPercentage;
    
    if (consistencyPercentage < 50) {
      return "Build consistency - aim for regular workout schedule";
    } else if (avgDuration < 30) {
      return "Increase workout duration for better results";
    } else if (data.totalCalories < 1500) {
      return "Boost intensity to maximize calorie burn";
    } else {
      return "Maintain excellence and push new boundaries";
    }
  }
}

export const emailService = new EmailService();
export type { WeeklyEmailData };