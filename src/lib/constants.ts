export const COUNCIL_NAME = "PPG Institute of Technology — Student Council";
export const ACADEMIC_YEAR = "2025 – 2026";
export const INSTITUTE_NAME = "PPG Institute of Technology";
export const INSTITUTE_ADDRESS = "NH 209, Sathy Main Road, Saravanampatti, Coimbatore – 641035, Tamil Nadu";

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  board: "Board Member",
  team_lead: "Team Lead",
  member: "Member",
};

export const ROLE_RANK: Record<string, number> = {
  super_admin: 5,
  admin: 4,
  board: 3,
  team_lead: 2,
  member: 1,
};

export function roleAtLeast(role: string | undefined, min: string) {
  if (!role) return false;
  return (ROLE_RANK[role] ?? 0) >= (ROLE_RANK[min] ?? 99);
}

export const TASK_STATUSES = [
  "backlog",
  "assigned",
  "in_progress",
  "waiting",
  "review",
  "completed",
  "rejected",
  "cancelled",
] as const;

export const TASK_STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  assigned: "Assigned",
  in_progress: "In Progress",
  waiting: "Waiting",
  review: "Review",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const KANBAN_COLUMNS = ["backlog", "assigned", "in_progress", "review", "completed"] as const;

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<string, string> = {
  normal: "Normal",
  important: "Important",
  urgent: "Urgent",
};

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  council_documents: "Council Documents",
  meeting_minutes: "Meeting Minutes",
  event_documents: "Event Documents",
  circulars: "Circulars",
  posters: "Posters",
  reports: "Reports",
  certificates: "Certificates",
  planning_documents: "Planning Documents",
};

export const DEMO_PASSWORD = "Ppgit@2026";
