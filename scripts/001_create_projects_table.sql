-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sponsor TEXT,
  project_manager TEXT,
  area TEXT,
  start_date DATE,
  planned_close_date DATE,
  actual_close_date DATE,
  initial_budget DECIMAL(15, 2),
  final_budget DECIMAL(15, 2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_closures table
CREATE TABLE IF NOT EXISTS project_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  executive_summary TEXT,
  main_objective TEXT,
  final_deliverables JSONB DEFAULT '[]',
  results_vs_objectives JSONB DEFAULT '{}',
  lessons_learned JSONB DEFAULT '[]',
  transition_owner TEXT,
  transition_manual_link TEXT,
  support_channel TEXT,
  handover_date DATE,
  is_published BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_closures_project_id ON project_closures(project_id);
CREATE INDEX IF NOT EXISTS idx_closures_share_token ON project_closures(share_token);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_closures_updated_at
  BEFORE UPDATE ON project_closures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
