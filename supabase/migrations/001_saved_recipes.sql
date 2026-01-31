-- Create saved_recipes table
CREATE TABLE saved_recipes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_saved_recipes_user_id ON saved_recipes(user_id);

-- Create index on created_at for sorting
CREATE INDEX idx_saved_recipes_created_at ON saved_recipes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own recipes
CREATE POLICY "Users can view own recipes"
  ON saved_recipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own recipes
CREATE POLICY "Users can insert own recipes"
  ON saved_recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own recipes
CREATE POLICY "Users can delete own recipes"
  ON saved_recipes
  FOR DELETE
  USING (auth.uid() = user_id);
