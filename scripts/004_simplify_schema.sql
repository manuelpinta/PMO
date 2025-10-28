-- Drop the old tables and create a single unified project_closures table
DROP TABLE IF EXISTS project_closures CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Create a single table for project closures with all fields from the image
CREATE TABLE project_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Project header
  project_name TEXT NOT NULL,
  project_id TEXT NOT NULL,
  sponsor TEXT,
  project_manager TEXT,
  area TEXT,
  
  -- Dates
  start_date DATE,
  planned_close_date DATE,
  actual_close_date DATE,
  
  -- Budget
  approved_budget NUMERIC(12, 2),
  actual_cost NUMERIC(12, 2),
  credit_note_expected TEXT, -- [+/- % / $]
  
  -- Executive summary
  executive_summary TEXT,
  
  -- Final deliverables (array of objects with name and link)
  final_deliverables JSONB DEFAULT '[]'::jsonb,
  
  -- Results vs objectives
  time_result TEXT, -- [Cumplido / +X días]
  cost_result TEXT, -- [En presupuesto / +X%]
  scope_result TEXT, -- [100% / Pendientes: X]
  estimated_benefit TEXT, -- $[ahorros/ROI]
  user_satisfaction TEXT, -- [NPS/Encuesta]
  materialized_risks TEXT, -- [Breve lista]
  
  -- Lessons learned (array of strings)
  lessons_repeat JSONB DEFAULT '[]'::jsonb,
  lessons_improve JSONB DEFAULT '[]'::jsonb,
  lessons_recommendations JSONB DEFAULT '[]'::jsonb,
  
  -- Transition to operations
  process_owner TEXT, -- [Área/Nombre]
  documentation_link TEXT, -- Link to project folder
  support_channel TEXT, -- [CONTACT_EMAIL]
  handover_date DATE,
  
  -- Sharing
  share_token TEXT UNIQUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_project_closures_user_id ON project_closures(user_id);
CREATE INDEX idx_project_closures_share_token ON project_closures(share_token);
CREATE INDEX idx_project_closures_project_id ON project_closures(project_id);

-- Enable RLS
ALTER TABLE project_closures ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own closures"
  ON project_closures FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own closures"
  ON project_closures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own closures"
  ON project_closures FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own closures"
  ON project_closures FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared closures"
  ON project_closures FOR SELECT
  USING (share_token IS NOT NULL);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_closures_updated_at
  BEFORE UPDATE ON project_closures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
