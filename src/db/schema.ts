import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const roleEnum = pgEnum("role", [
  "super_admin",
  "admin",
  "board",
  "team_lead",
  "member",
]);

export const memberCategoryEnum = pgEnum("member_category", [
  "board",
  "executive",
  "committee",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "backlog",
  "assigned",
  "in_progress",
  "waiting",
  "review",
  "completed",
  "rejected",
  "cancelled",
]);

export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"]);

export const conversationTypeEnum = pgEnum("conversation_type", [
  "direct",
  "team",
  "council",
  "board",
  "task",
]);

export const pollTypeEnum = pgEnum("poll_type", ["single", "multiple", "yes_no"]);

export const eventStatusEnum = pgEnum("event_status", [
  "planned",
  "confirmed",
  "ongoing",
  "completed",
  "cancelled",
]);

export const announcementAudienceEnum = pgEnum("announcement_audience", [
  "everyone",
  "board",
  "team",
  "members",
]);

export const announcementPriorityEnum = pgEnum("announcement_priority", [
  "normal",
  "important",
  "urgent",
]);

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late",
  "excused",
]);

export const documentCategoryEnum = pgEnum("document_category", [
  "council_documents",
  "meeting_minutes",
  "event_documents",
  "circulars",
  "posters",
  "reports",
  "certificates",
  "planning_documents",
]);

// ---------------------------------------------------------------------------
// Core identity
// ---------------------------------------------------------------------------
export const members = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    position: varchar("position", { length: 120 }),
    department: varchar("department", { length: 40 }).notNull(),
    year: varchar("year", { length: 10 }).notNull(),
    registerNumber: varchar("register_number", { length: 40 }),
    registerNumberVisible: boolean("register_number_visible").notNull().default(false),
    category: memberCategoryEnum("category").notNull().default("committee"),
    committeeName: varchar("committee_name", { length: 120 }),
    bio: text("bio"),
    skills: text("skills"),
    responsibilities: text("responsibilities"),
    photoUrl: text("photo_url"),
    joinedDate: timestamp("joined_date", { withTimezone: true }).defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("members_slug_idx").on(table.slug)],
);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 190 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("member"),
    memberId: integer("member_id").references(() => members.id, { onDelete: "set null" }),
    isActive: boolean("is_active").notNull().default(true),
    theme: varchar("theme", { length: 10 }).notNull().default("system"),
    notifyEmail: boolean("notify_email").notNull().default(true),
    notifyPush: boolean("notify_push").notNull().default(true),
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 64 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("sessions_token_idx").on(table.tokenHash)],
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 128 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------
export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    description: text("description"),
    leadMemberId: integer("lead_member_id").references(() => members.id, { onDelete: "set null" }),
    color: varchar("color", { length: 20 }).notNull().default("indigo"),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("teams_slug_idx").on(table.slug)],
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
    memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    roleInTeam: varchar("role_in_team", { length: 60 }).notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("team_member_unique_idx").on(table.teamId, table.memberId)],
);

// ---------------------------------------------------------------------------
// Files (metadata only — binary content lives on disk / object storage)
// ---------------------------------------------------------------------------
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id").references(() => users.id, { onDelete: "set null" }),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  storageKey: varchar("storage_key", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 120 }).notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 20 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    createdByUserId: integer("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    teamId: integer("team_id").references(() => teams.id, { onDelete: "set null" }),
    priority: taskPriorityEnum("priority").notNull().default("medium"),
    status: taskStatusEnum("status").notNull().default("backlog"),
    startDate: timestamp("start_date", { withTimezone: true }),
    deadline: timestamp("deadline", { withTimezone: true }),
    progress: integer("progress").notNull().default(0),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("tasks_code_idx").on(table.code), index("tasks_status_idx").on(table.status)],
);

export const taskAssignees = pgTable(
  "task_assignees",
  {
    id: serial("id").primaryKey(),
    taskId: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("task_assignee_unique_idx").on(table.taskId, table.memberId)],
);

export const taskChecklistItems = pgTable("task_checklist_items", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 240 }).notNull(),
  done: boolean("done").notNull().default(false),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const taskComments = pgTable("task_comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  authorUserId: integer("author_user_id").references(() => users.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const taskUpdates = pgTable("task_updates", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  authorUserId: integer("author_user_id").references(() => users.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  progress: integer("progress"),
  fileId: integer("file_id").references(() => files.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  type: conversationTypeEnum("type").notNull(),
  name: varchar("name", { length: 160 }),
  teamId: integer("team_id").references(() => teams.id, { onDelete: "cascade" }),
  taskId: integer("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conversationMembers = pgTable(
  "conversation_members",
  {
    id: serial("id").primaryKey(),
    conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("conversation_member_unique_idx").on(table.conversationId, table.userId)],
);

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    senderUserId: integer("sender_user_id").references(() => users.id, { onDelete: "set null" }),
    content: text("content"),
    replyToId: integer("reply_to_id"),
    fileId: integer("file_id").references(() => files.id, { onDelete: "set null" }),
    pinned: boolean("pinned").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("messages_conversation_idx").on(table.conversationId, table.createdAt)],
);

export const messageReactions = pgTable(
  "message_reactions",
  {
    id: serial("id").primaryKey(),
    messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    emoji: varchar("emoji", { length: 10 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("reaction_unique_idx").on(table.messageId, table.userId, table.emoji)],
);

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 40 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    body: text("body"),
    link: text("link"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("notifications_user_idx").on(table.userId, table.isRead)],
);

// ---------------------------------------------------------------------------
// Polls
// ---------------------------------------------------------------------------
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 260 }).notNull(),
  description: text("description"),
  type: pollTypeEnum("type").notNull().default("single"),
  anonymous: boolean("anonymous").notNull().default(false),
  createdByUserId: integer("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
  audienceTeamId: integer("audience_team_id").references(() => teams.id, { onDelete: "set null" }),
  closesAt: timestamp("closes_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pollOptions = pgTable("poll_options", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 200 }).notNull(),
  position: integer("position").notNull().default(0),
});

export const pollVotes = pgTable(
  "poll_votes",
  {
    id: serial("id").primaryKey(),
    pollId: integer("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
    optionId: integer("option_id").notNull().references(() => pollOptions.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("poll_vote_unique_idx").on(table.pollId, table.optionId, table.userId)],
);

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  venue: varchar("venue", { length: 200 }),
  organizerUserId: integer("organizer_user_id").references(() => users.id, { onDelete: "set null" }),
  teamId: integer("team_id").references(() => teams.id, { onDelete: "set null" }),
  status: eventStatusEnum("status").notNull().default("planned"),
  isPublic: boolean("is_public").notNull().default(true),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventParticipants = pgTable(
  "event_participants",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 30 }).notNull().default("invited"),
  },
  (table) => [uniqueIndex("event_participant_unique_idx").on(table.eventId, table.memberId)],
);

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  authorUserId: integer("author_user_id").references(() => users.id, { onDelete: "set null" }),
  priority: announcementPriorityEnum("priority").notNull().default("normal"),
  audience: announcementAudienceEnum("audience").notNull().default("everyone"),
  audienceTeamId: integer("audience_team_id").references(() => teams.id, { onDelete: "set null" }),
  publishAt: timestamp("publish_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  isDemo: boolean("is_demo").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  category: documentCategoryEnum("category").notNull().default("council_documents"),
  fileId: integer("file_id").notNull().references(() => files.id, { onDelete: "cascade" }),
  uploadedByUserId: integer("uploaded_by_user_id").references(() => users.id, { onDelete: "set null" }),
  accessLevel: roleEnum("access_level").notNull().default("member"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Meetings
// ---------------------------------------------------------------------------
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 200 }),
  organizerUserId: integer("organizer_user_id").references(() => users.id, { onDelete: "set null" }),
  agenda: text("agenda"),
  notes: text("notes"),
  decisions: text("decisions"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const meetingParticipants = pgTable(
  "meeting_participants",
  {
    id: serial("id").primaryKey(),
    meetingId: integer("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    attendance: attendanceStatusEnum("attendance"),
  },
  (table) => [uniqueIndex("meeting_participant_unique_idx").on(table.meetingId, table.memberId)],
);

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 120 }).notNull(),
    objectType: varchar("object_type", { length: 60 }),
    objectId: varchar("object_id", { length: 60 }),
    metadata: jsonb("metadata"),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_logs_created_idx").on(table.createdAt)],
);
