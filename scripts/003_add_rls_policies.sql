-- Enable Row Level Security on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Projects policies: Only authenticated users can manage projects
CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Enable Row Level Security on project_closures table
ALTER TABLE project_closures ENABLE ROW LEVEL SECURITY;

-- Project closures policies: Authenticated users can manage, public can view shared
CREATE POLICY "Authenticated users can view all closures"
  ON project_closures FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view shared closures"
  ON project_closures FOR SELECT
  TO anon
  USING (share_token IS NOT NULL);

CREATE POLICY "Authenticated users can insert closures"
  ON project_closures FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update closures"
  ON project_closures FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete closures"
  ON project_closures FOR DELETE
  TO authenticated
  USING (true);
