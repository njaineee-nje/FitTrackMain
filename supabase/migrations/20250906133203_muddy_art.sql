/*
  # Fix Users Table RLS Policies

  1. Security Updates
    - Drop existing restrictive policies that prevent user creation
    - Add proper INSERT policy for authenticated users
    - Add proper SELECT policy for users to read their own data
    - Add proper UPDATE policy for users to update their own data

  2. Policy Changes
    - Allow authenticated users to insert their own user records
    - Allow users to read their own profile data
    - Allow users to update their own profile data
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies that allow proper user registration and management
CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users based on user_id"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Also allow users to read user data by email for registration checks
CREATE POLICY "Enable select by email for registration"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);