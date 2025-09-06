/*
  # Create user activities table

  1. New Tables
    - `user_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `activity_type` (text: run, ride, swim, workout)
      - `title` (text)
      - `duration` (integer, minutes)
      - `distance` (decimal, km)
      - `calories` (integer)
      - `activity_date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_activities` table
    - Add policies for users to manage their own activities
*/

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('run', 'ride', 'swim', 'workout')),
  title text NOT NULL,
  duration integer NOT NULL DEFAULT 0, -- in minutes
  distance decimal(10,2) DEFAULT 0, -- in km
  calories integer DEFAULT 0,
  activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own activities"
  ON user_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activities"
  ON user_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own activities"
  ON user_activities
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own activities"
  ON user_activities
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());