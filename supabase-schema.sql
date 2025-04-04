-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_participants table for tracking who is attending events
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('invited', 'attending', 'declined', 'maybe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create friendships table
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CONSTRAINT different_users CHECK (user_id <> friend_id)
);

-- Create RLS policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert any profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Events policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = created_by);

CREATE POLICY "Public events are viewable by everyone"
  ON events FOR SELECT
  USING (is_public = true);

-- Event participants policies
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event creators can view participants"
  ON event_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view their own participation"
  ON event_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Event creators can insert participants"
  ON event_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own participation"
  ON event_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- Friendships policies
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friendships"
  ON friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert friendship requests"
  ON friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can update friendship status"
  ON friendships FOR UPDATE
  USING (auth.uid() = friend_id AND status = 'pending');

CREATE POLICY "Users can delete their own friendships"
  ON friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_event_participants_updated_at
  BEFORE UPDATE ON event_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();