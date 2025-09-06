import { supabase, UserActivity } from '../lib/supabase';

export interface CreateActivityData {
  userId: string;
  activityType: 'run' | 'ride' | 'swim' | 'workout';
  title: string;
  duration: number; // minutes
  distance?: number; // km
  calories: number;
  activityDate?: string; // YYYY-MM-DD format
}

class ActivityService {
  async createActivity(activityData: CreateActivityData): Promise<UserActivity | null> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .insert({
          user_id: activityData.userId,
          activity_type: activityData.activityType,
          title: activityData.title,
          duration: activityData.duration,
          distance: activityData.distance || 0,
          calories: activityData.calories,
          activity_date: activityData.activityDate || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) {
        console.error('ActivityService: Error creating activity:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('ActivityService: Exception creating activity:', error);
      return null;
    }
  }

  async getUserActivities(userId: string, limit?: number): Promise<UserActivity[]> {
    try {
      let query = supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('ActivityService: Error fetching user activities:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('ActivityService: Exception fetching user activities:', error);
      return [];
    }
  }

  async getWeeklyActivities(userId: string, weekStart: string): Promise<UserActivity[]> {
    try {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .gte('activity_date', weekStart)
        .lte('activity_date', weekEnd.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      if (error) {
        console.error('ActivityService: Error fetching weekly activities:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('ActivityService: Exception fetching weekly activities:', error);
      return [];
    }
  }

  async getUserStats(userId: string): Promise<{
    totalActivities: number;
    totalDuration: number;
    totalDistance: number;
    totalCalories: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('duration, distance, calories')
        .eq('user_id', userId);

      if (error) {
        console.error('ActivityService: Error fetching user stats:', error);
        return { totalActivities: 0, totalDuration: 0, totalDistance: 0, totalCalories: 0 };
      }

      const stats = data.reduce(
        (acc, activity) => ({
          totalActivities: acc.totalActivities + 1,
          totalDuration: acc.totalDuration + activity.duration,
          totalDistance: acc.totalDistance + (activity.distance || 0),
          totalCalories: acc.totalCalories + activity.calories,
        }),
        { totalActivities: 0, totalDuration: 0, totalDistance: 0, totalCalories: 0 }
      );

      return stats;
    } catch (error) {
      console.error('ActivityService: Exception fetching user stats:', error);
      return { totalActivities: 0, totalDuration: 0, totalDistance: 0, totalCalories: 0 };
    }
  }
}

export const activityService = new ActivityService();