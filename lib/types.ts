export interface Deliverable {
  name: string
  link: string
}

export interface ProjectClosure {
  id: string
  user_id: string

  // Project header
  project_name: string
  project_id: string
  sponsor: string | null
  project_manager: string | null
  area: string | null

  // Dates
  start_date: string | null
  planned_close_date: string | null
  actual_close_date: string | null

  // Budget
  approved_budget: number | null
  actual_cost: number | null
  credit_note_expected: string | null

  // Executive summary
  executive_summary: string | null

  // Final deliverables
  final_deliverables: Deliverable[]

  // Results vs objectives
  time_result: string | null
  cost_result: string | null
  scope_result: string | null
  estimated_benefit: string | null
  user_satisfaction: string | null
  materialized_risks: string | null

  // Lessons learned
  lessons_repeat: string[]
  lessons_improve: string[]
  lessons_recommendations: string[]

  // Transition
  process_owner: string | null
  documentation_link: string | null
  support_channel: string | null
  handover_date: string | null

  // Sharing
  share_token: string | null

  created_at: string
  updated_at: string
}
