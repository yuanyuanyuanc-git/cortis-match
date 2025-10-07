-- Create the game_events table
CREATE TABLE IF NOT EXISTS game_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL,
  user_agent TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on event_name for faster queries
CREATE INDEX IF NOT EXISTS idx_game_events_event_name ON game_events(event_name);

-- Create an index on timestamp for time-based queries
CREATE INDEX IF NOT EXISTS idx_game_events_timestamp ON game_events(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert events (for logging)
CREATE POLICY "Allow public insert" ON game_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create a policy that allows authenticated users to read all events
CREATE POLICY "Allow authenticated read" ON game_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Optionally: Allow anonymous users to read their own events (if you want)
-- Uncomment the line below if needed:
-- CREATE POLICY "Allow public read own events" ON game_events
--   FOR SELECT
--   TO anon
--   USING (true);
