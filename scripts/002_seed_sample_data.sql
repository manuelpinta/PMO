-- Insert sample project
INSERT INTO projects (
  project_id,
  name,
  sponsor,
  project_manager,
  area,
  start_date,
  planned_close_date,
  actual_close_date,
  initial_budget,
  final_budget,
  status
) VALUES (
  'PMO-2025-001',
  'Pintacomex PMO',
  'Rolando Flores',
  'Marcos Hernández',
  'Project Management Office (PMO)',
  '2025-07-01',
  '2025-08-30',
  '2025-09-26',
  1120000,
  1120000,
  'closed'
) ON CONFLICT (project_id) DO NOTHING;

-- Insert sample closure for the project
INSERT INTO project_closures (
  project_id,
  executive_summary,
  main_objective,
  final_deliverables,
  results_vs_objectives,
  lessons_learned,
  transition_owner,
  transition_manual_link,
  support_channel,
  handover_date,
  is_published
)
SELECT 
  p.id,
  'B=4 líneas: objetivo, alcance logrado, resultado principal, impacto para operación/comercial',
  'Implementar sistema de gestión de proyectos',
  '[
    {"name": "Entregable 1", "status": "enlace/ubicación"},
    {"name": "Entregable 2", "status": "enlace/ubicación"},
    {"name": "Entregable 3", "status": "enlace/ubicación"}
  ]'::jsonb,
  '{
    "completed": ">=80%",
    "onTime": "3 de 3 hitos",
    "budget": "100% Presupuesto X",
    "quality": "Bugs total",
    "satisfaction": "Encuesta"
  }'::jsonb,
  '[
    {"type": "repeat", "description": "Qué repetir"},
    {"type": "improve", "description": "Qué mejorar"},
    {"type": "recommendation", "description": "Recomendaciones"}
  ]'::jsonb,
  'Área/Nombre',
  'Link al drive',
  'Canal de soporte',
  '2025-09-26',
  true
FROM projects p
WHERE p.project_id = 'PMO-2025-001'
ON CONFLICT DO NOTHING;
