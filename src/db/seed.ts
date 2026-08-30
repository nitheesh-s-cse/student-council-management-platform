import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool } from "@/db";
import {
  members,
  users,
  teams,
  teamMembers,
  tasks,
  taskAssignees,
  taskChecklistItems,
  announcements,
  events,
  eventParticipants,
  polls,
  pollOptions,
  conversations,
  conversationMembers,
  messages,
} from "@/db/schema";
import { BOARD_MEMBERS, EXECUTIVE_MEMBERS, COMMITTEES, type SeedMember } from "@/db/seed-data";
import { slugify } from "@/lib/utils";
import { DEMO_PASSWORD } from "@/lib/constants";

async function main() {
  console.log("Seeding PPGIT Student Council database...");

  console.log("Cleaning existing database data...");
  await db.delete(messages);
  await db.delete(conversationMembers);
  await db.delete(conversations);
  await db.delete(pollOptions);
  await db.delete(polls);
  await db.delete(eventParticipants);
  await db.delete(events);
  await db.delete(announcements);
  await db.delete(taskChecklistItems);
  await db.delete(taskAssignees);
  await db.delete(tasks);
  await db.delete(teamMembers);
  await db.delete(teams);
  await db.delete(users);
  await db.delete(members);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const slugCounts = new Map<string, number>();

  function uniqueSlug(name: string) {
    const base = slugify(name);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  }

  const emailCounts = new Map<string, number>();

  function emailFor(name: string, dept: string) {
    const base = slugify(`${name}-${dept}`).replace(/-/g, ".");
    const count = emailCounts.get(base) ?? 0;
    emailCounts.set(base, count + 1);
    const local = count === 0 ? base : `${base}.${count + 1}`;
    return `${local}@council.ppgit.edu.in`;
  }

  // --- Board members -------------------------------------------------
  const boardRoleMap: Record<string, "admin" | "board"> = {
    President: "admin",
    "Vice President": "admin",
  };

  const insertedMembers: { id: number; seed: SeedMember; userId?: number }[] = [];

  for (const m of BOARD_MEMBERS) {
    const [row] = await db
      .insert(members)
      .values({
        slug: uniqueSlug(m.fullName),
        fullName: m.fullName,
        position: m.position,
        department: m.department,
        year: m.year,
        category: "board",
        registerNumberVisible: false,
        bio: `${m.position} of the PPG Institute of Technology Student Council, representing the ${m.department} department.`,
        responsibilities: "Council governance, policy decisions and cross-team coordination.",
      })
      .returning({ id: members.id });

    const role = boardRoleMap[m.position ?? ""] ?? "board";
    const [user] = await db
      .insert(users)
      .values({
        email: emailFor(m.fullName, m.department),
        passwordHash,
        role,
        memberId: row.id,
      })
      .returning({ id: users.id });

    insertedMembers.push({ id: row.id, seed: m, userId: user.id });
  }

  // Dedicated system super-admin (not tied to a public member profile).
  const [superAdmin] = await db
    .insert(users)
    .values({
      email: "superadmin@council.ppgit.edu.in",
      passwordHash,
      role: "super_admin",
    })
    .returning({ id: users.id });

  // --- Executive members ----------------------------------------------
  for (const m of EXECUTIVE_MEMBERS) {
    const [row] = await db
      .insert(members)
      .values({
        slug: uniqueSlug(m.fullName),
        fullName: m.fullName,
        position: m.position,
        department: m.department,
        year: m.year,
        category: "executive",
        registerNumberVisible: false,
        bio: `Executive member of the PPG Institute of Technology Student Council from the ${m.department} department.`,
        responsibilities: "Supports council-wide initiatives and represents peers in their department.",
      })
      .returning({ id: members.id });

    const [user] = await db
      .insert(users)
      .values({
        email: emailFor(m.fullName, m.department),
        passwordHash,
        role: "member",
        memberId: row.id,
      })
      .returning({ id: users.id });

    insertedMembers.push({ id: row.id, seed: m, userId: user.id });
  }

  // --- Committees / teams ----------------------------------------------
  const teamIds: Record<string, number> = {};

  for (const committee of COMMITTEES) {
    const [team] = await db
      .insert(teams)
      .values({
        name: committee.name,
        slug: committee.slug,
        description: committee.description,
      })
      .returning({ id: teams.id });
    teamIds[committee.slug] = team.id;

    let leadMemberId: number | null = null;
    let leadUserId: number | null = null;

    for (let i = 0; i < committee.members.length; i++) {
      const m = committee.members[i];
      const isLead = i === 0;
      const [row] = await db
        .insert(members)
        .values({
          slug: uniqueSlug(m.fullName),
          fullName: m.fullName,
          position: isLead ? "Team Lead" : "Committee Member",
          department: m.department,
          year: m.year,
          category: "committee",
          committeeName: committee.name,
          registerNumberVisible: false,
          bio: `${isLead ? "Team Lead of" : "Member of"} the ${committee.name} committee, PPGIT Student Council.`,
          responsibilities: isLead
            ? `Leads the ${committee.name} committee and coordinates task delivery.`
            : `Contributes to ${committee.name} initiatives and events.`,
        })
        .returning({ id: members.id });

      const [user] = await db
        .insert(users)
        .values({
          email: emailFor(m.fullName, m.department),
          passwordHash,
          role: isLead ? "team_lead" : "member",
          memberId: row.id,
        })
        .returning({ id: users.id });

      insertedMembers.push({ id: row.id, seed: { ...m, category: "committee" }, userId: user.id });

      await db.insert(teamMembers).values({
        teamId: team.id,
        memberId: row.id,
        roleInTeam: isLead ? "lead" : "member",
      });

      if (isLead) {
        leadMemberId = row.id;
        leadUserId = user.id;
      }
    }

    if (leadMemberId) {
      await db.update(teams).set({ leadMemberId }).where(eq(teams.id, team.id));
    }

    // Team group chat
    const [conv] = await db
      .insert(conversations)
      .values({ type: "team", name: `${committee.name} Team`, teamId: team.id })
      .returning({ id: conversations.id });

    const memberUserIds = insertedMembers
      .filter((im) => im.seed.category === "committee" && im.seed.committeeName === committee.name)
      .map((im) => im.userId!)
      .filter(Boolean);

    for (const uid of memberUserIds) {
      await db.insert(conversationMembers).values({ conversationId: conv.id, userId: uid });
    }

    if (leadUserId) {
      await db.insert(messages).values({
        conversationId: conv.id,
        senderUserId: leadUserId,
        content: `Welcome to the ${committee.name} team workspace! Let's plan our next initiative here.`,
      });
    }
  }

  // --- Council-wide + board conversations -------------------------------
  const allUserIds = insertedMembers.map((m) => m.userId!).filter(Boolean).concat(superAdmin.id);
  const [councilConv] = await db
    .insert(conversations)
    .values({ type: "council", name: "PPGIT Student Council — General" })
    .returning({ id: conversations.id });
  for (const uid of allUserIds) {
    await db.insert(conversationMembers).values({ conversationId: councilConv.id, userId: uid });
  }
  const presidentUserId = insertedMembers.find((m) => m.seed.position === "President")?.userId;
  if (presidentUserId) {
    await db.insert(messages).values({
      conversationId: councilConv.id,
      senderUserId: presidentUserId,
      content: "Welcome everyone to the new Student Council workspace for the 2025–26 term!",
    });
  }

  const boardUserIds = insertedMembers
    .filter((m) => m.seed.category === "board")
    .map((m) => m.userId!)
    .concat(superAdmin.id);
  const [boardConv] = await db
    .insert(conversations)
    .values({ type: "board", name: "Board Room" })
    .returning({ id: conversations.id });
  for (const uid of boardUserIds) {
    await db.insert(conversationMembers).values({ conversationId: boardConv.id, userId: uid });
  }

  // --- Demo tasks ---------------------------------------------------------
  const mediaTeamId = teamIds["public-relations-social-media"];
  const eventTeamId = teamIds["event-management"];
  const webOpsTeamId = teamIds["web-ops"];

  const prMembers = insertedMembers.filter(
    (m) => m.seed.category === "committee" && m.seed.committeeName === "Public Relations & Social Media",
  );
  const eventMembers = insertedMembers.filter(
    (m) => m.seed.category === "committee" && m.seed.committeeName === "Event Management",
  );
  const webOpsMembers = insertedMembers.filter(
    (m) => m.seed.category === "committee" && m.seed.committeeName === "Web Ops",
  );

  const boardCreator = insertedMembers.find((m) => m.seed.position === "Secretary")?.userId ?? superAdmin.id;

  const taskSeeds = [
    {
      code: "PPG-101",
      title: "Design Tech Fest 2026 poster",
      description: "Create the primary poster artwork for Tech Fest, including social + print variants.",
      teamId: mediaTeamId,
      members: prMembers.slice(0, 3),
      priority: "high" as const,
      status: "in_progress" as const,
      progress: 60,
      checklist: [
        { label: "Collect content from event heads", done: true },
        { label: "Create first design draft", done: true },
        { label: "Internal review", done: false },
        { label: "Final approval from Board", done: false },
        { label: "Publish across channels", done: false },
      ],
    },
    {
      code: "PPG-102",
      title: "Coordinate venue logistics for Annual Day",
      description: "Confirm auditorium booking, seating layout and AV requirements.",
      teamId: eventTeamId,
      members: eventMembers.slice(0, 3),
      priority: "urgent" as const,
      status: "review" as const,
      progress: 80,
      checklist: [
        { label: "Book auditorium", done: true },
        { label: "Confirm AV vendor", done: true },
        { label: "Finalize seating chart", done: true },
        { label: "Get faculty sign-off", done: false },
      ],
    },
    {
      code: "PPG-103",
      title: "Council platform onboarding checklist",
      description: "Prepare onboarding docs so every committee member can use the new council platform.",
      teamId: webOpsTeamId,
      members: webOpsMembers,
      priority: "medium" as const,
      status: "assigned" as const,
      progress: 20,
      checklist: [
        { label: "Draft onboarding guide", done: true },
        { label: "Record walkthrough video", done: false },
        { label: "Share with all committees", done: false },
      ],
    },
    {
      code: "PPG-104",
      title: "Plan Freshers' Day welcome kit",
      description: "Curate welcome kit contents and sponsorship tie-ins for incoming first years.",
      teamId: eventTeamId,
      members: eventMembers.slice(3, 6),
      priority: "medium" as const,
      status: "backlog" as const,
      progress: 0,
      checklist: [
        { label: "Shortlist kit items", done: false },
        { label: "Reach out to sponsors", done: false },
      ],
    },
  ];

  for (const t of taskSeeds) {
    const [task] = await db
      .insert(tasks)
      .values({
        code: t.code,
        title: t.title,
        description: t.description,
        createdByUserId: boardCreator,
        teamId: t.teamId,
        priority: t.priority,
        status: t.status,
        progress: t.progress,
        startDate: new Date(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      })
      .returning({ id: tasks.id });

    for (const m of t.members) {
      if (!m) continue;
      await db.insert(taskAssignees).values({ taskId: task.id, memberId: m.id });
    }

    for (let i = 0; i < t.checklist.length; i++) {
      await db.insert(taskChecklistItems).values({
        taskId: task.id,
        label: t.checklist[i].label,
        done: t.checklist[i].done,
        position: i,
      });
    }

    // Task discussion thread
    const [taskConv] = await db
      .insert(conversations)
      .values({ type: "task", name: `${t.code} discussion`, taskId: task.id })
      .returning({ id: conversations.id });
    const participantUserIds = [boardCreator, ...t.members.map((m) => m?.userId)].filter(Boolean) as number[];
    for (const uid of new Set(participantUserIds)) {
      await db.insert(conversationMembers).values({ conversationId: taskConv.id, userId: uid });
    }
  }

  // --- Announcements -------------------------------------------------
  const secretaryUserId = insertedMembers.find((m) => m.seed.position === "Secretary")?.userId ?? superAdmin.id;
  await db.insert(announcements).values([
    {
      title: "Student Council Platform is Live",
      content:
        "Welcome to the official PPGIT Student Council operating system. Use it to track tasks, chat with your team and stay updated on council activity.",
      authorUserId: secretaryUserId,
      priority: "important",
      audience: "everyone",
    },
    {
      title: "Tech Fest 2026 Planning Kickoff",
      content: "All committee leads please submit your budget proposals by the end of this week.",
      authorUserId: secretaryUserId,
      priority: "urgent",
      audience: "board",
    },
  ]);

  // --- Events ----------------------------------------------------------
  await db.insert(events).values([
    {
      title: "Council Orientation & Induction",
      description: "Welcome session introducing the 2025-26 Student Council to the campus.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      venue: "Main Auditorium",
      organizerUserId: secretaryUserId,
      teamId: eventTeamId,
      status: "confirmed",
      isPublic: true,
    },
    {
      title: "Tech Fest 2026",
      description: "Flagship annual technical festival featuring hackathons, workshops and expos.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      venue: "PPGIT Campus Grounds",
      organizerUserId: boardCreator,
      teamId: eventTeamId,
      status: "planned",
      isPublic: true,
    },
    {
      title: "Board Strategy Meeting",
      description: "Internal planning meeting for the board on Q2 initiatives.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      venue: "Council Room",
      organizerUserId: secretaryUserId,
      status: "confirmed",
      isPublic: false,
    },
  ]);

  // --- Poll --------------------------------------------------------------
  const [poll] = await db
    .insert(polls)
    .values({
      question: "Which date should we conduct the Tech Fest 2026 closing ceremony?",
      description: "Pick the date that works best for most committees.",
      type: "single",
      anonymous: false,
      createdByUserId: secretaryUserId,
      closesAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    })
    .returning({ id: polls.id });

  await db.insert(pollOptions).values([
    { pollId: poll.id, label: "September 12", position: 0 },
    { pollId: poll.id, label: "September 13", position: 1 },
    { pollId: poll.id, label: "September 14", position: 2 },
  ]);

  console.log(`Seed complete: ${insertedMembers.length} members, ${COMMITTEES.length} teams, ${taskSeeds.length} tasks.`);
  console.log(`All seeded accounts use the password: ${DEMO_PASSWORD}`);
  console.log(`Super admin login: superadmin@council.ppgit.edu.in`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
