-- Cambiar campos numéricos a texto para permitir cualquier valor
-- Los campos vacíos no se mostrarán en la vista

ALTER TABLE project_closures 
  ALTER COLUMN approved_budget TYPE TEXT,
  ALTER COLUMN actual_cost TYPE TEXT,
  ALTER COLUMN credit_note_expected TYPE TEXT,
  ALTER COLUMN estimated_benefit TYPE TEXT;

-- Actualizar valores NULL a cadena vacía si es necesario
UPDATE project_closures 
SET 
  approved_budget = COALESCE(approved_budget, ''),
  actual_cost = COALESCE(actual_cost, ''),
  credit_note_expected = COALESCE(credit_note_expected, ''),
  estimated_benefit = COALESCE(estimated_benefit, '')
WHERE 
  approved_budget IS NULL 
  OR actual_cost IS NULL 
  OR credit_note_expected IS NULL 
  OR estimated_benefit IS NULL;
