import { supabase, User } from '../lib/supabase';

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  emailNotifications?: boolean;
  weeklyReports?: boolean;
}

class UserService {
  async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      console.log('UserService: Creating user with data:', userData);
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          avatar_url: userData.avatarUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('UserService: Error creating user:', error);
        return null;
      }

      console.log('UserService: User created successfully:', data);
      return data;
    } catch (error) {
      console.error('UserService: Exception creating user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('UserService: Error fetching user by email:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('UserService: Exception fetching user by email:', error);
      return null;
    }
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<User | null> {
    try {
      const updateData: any = {};
      
      if (userData.firstName) updateData.first_name = userData.firstName;
      if (userData.lastName) updateData.last_name = userData.lastName;
      if (userData.avatarUrl) updateData.avatar_url = userData.avatarUrl;
      if (userData.emailNotifications !== undefined) updateData.email_notifications = userData.emailNotifications;
      if (userData.weeklyReports !== undefined) updateData.weekly_reports = userData.weeklyReports;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('UserService: Error updating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('UserService: Exception updating user:', error);
      return null;
    }
  }

  async getAllUsersWithWeeklyReports(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('weekly_reports', true);

      if (error) {
        console.error('UserService: Error fetching users for weekly reports:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('UserService: Exception fetching users for weekly reports:', error);
      return [];
    }
  }
}

export const userService = new UserService();