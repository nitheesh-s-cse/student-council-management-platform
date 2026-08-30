// Real Student Council roster for PPG Institute of Technology, sourced from
// the council's official member list. This file intentionally contains only
// verified names/departments/years supplied by the council — no fabricated
// personal data is added. Fields not present in the source (photos, bios,
// register numbers, etc.) are left blank/false and can be completed by an
// admin from the Secure Control member editor.

export type SeedMember = {
  fullName: string;
  department: string;
  year: string;
  category: "board" | "executive" | "committee";
  position?: string;
  committeeName?: string;
};

export const BOARD_MEMBERS: SeedMember[] = [
  { fullName: "Tameema Naazmi. M.R.", department: "BME", year: "IV", category: "board", position: "President" },
  { fullName: "Rahul Krishnith", department: "AIDS", year: "IV", category: "board", position: "Vice President" },
  { fullName: "Mohammed Jubair A", department: "CSE", year: "III", category: "board", position: "Secretary" },
  { fullName: "Priya .T", department: "BME", year: "II", category: "board", position: "Joint Secretary" },
  { fullName: "Sandhya Raga", department: "CSE", year: "III", category: "board", position: "Treasurer" },
  { fullName: "Priya Dharshini", department: "AIML", year: "II", category: "board", position: "Joint Treasurer" },
];

export const EXECUTIVE_MEMBERS: SeedMember[] = [
  { fullName: "Nakshatra. V", department: "ECE", year: "IV" },
  { fullName: "Soma Prabha", department: "AGRI", year: "III" },
  { fullName: "Dharshan Sri", department: "MECH", year: "III" },
  { fullName: "Priya Dharshini", department: "AIML", year: "II" },
  { fullName: "Nandhan", department: "CSE", year: "III" },
  { fullName: "Nitheesh", department: "CSE", year: "III" },
  { fullName: "Priya", department: "BME", year: "II" },
  { fullName: "Sandhiya", department: "CSE", year: "III" },
  { fullName: "Naveen Shriram", department: "AIDS", year: "II" },
  { fullName: "Dakshitha", department: "CSE", year: "II" },
  { fullName: "Kavya Dharshini", department: "AGRI", year: "III" },
  { fullName: "Kavi Nishanthini", department: "AGRI", year: "IV" },
  { fullName: "Nisha", department: "AGRI", year: "IV" },
  { fullName: "Mohammed Akthar", department: "IT", year: "II" },
  { fullName: "Semmozhivan", department: "CSE", year: "IV" },
  { fullName: "Vyas", department: "AIML", year: "III" },
  { fullName: "Vishal", department: "AIDS", year: "IV" },
  { fullName: "Sarmila", department: "AGRI", year: "IV" },
  { fullName: "Ryeona Sherin", department: "IT", year: "IV" },
  { fullName: "Anusha Angel", department: "AIDS", year: "III" },
  { fullName: "Rahul S J", department: "MECH", year: "III" },
  { fullName: "Harini", department: "CSE", year: "II" },
  { fullName: "Sathya", department: "IT", year: "III" },
  { fullName: "Pranesh", department: "AIML", year: "II" },
  { fullName: "Anand", department: "IT", year: "IV" },
].map((m) => ({ ...m, category: "executive" as const, position: "Executive Member" }));

type CommitteeMember = Omit<SeedMember, "category">;

export const COMMITTEES: { name: string; slug: string; description: string; members: CommitteeMember[] }[] = [
  {
    name: "Web Ops",
    slug: "web-ops",
    description: "Builds and maintains the council's digital platforms, websites and technical infrastructure.",
    members: [
      { fullName: "Mervinth", department: "CSE", year: "II" },
      { fullName: "Praveen Kumar G", department: "CSE", year: "III" },
      { fullName: "Dharshini Sri", department: "CSE", year: "II" },
    ],
  },
  {
    name: "Culturals",
    slug: "culturals",
    description: "Plans and executes cultural fests, stage shows and performing-arts programs.",
    members: [
      { fullName: "Praveen", department: "MECH", year: "III" },
      { fullName: "Kavi Bharathi", department: "CSE", year: "III" },
      { fullName: "Tharshini Shree", department: "CSE", year: "III" },
      { fullName: "Vasanth", department: "MECH", year: "III" },
      { fullName: "Saraswathi", department: "IT", year: "III" },
      { fullName: "Madhumitha", department: "CSE", year: "II" },
      { fullName: "Vishnuragav", department: "CSE", year: "II" },
      { fullName: "Vasanth", department: "CSE", year: "II" },
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Organizes intramural tournaments and represents the institute at inter-college sports meets.",
    members: [
      { fullName: "Bala Ganesh", department: "IT", year: "IV" },
      { fullName: "Bharathi Kannan R.K", department: "IT", year: "IV" },
      { fullName: "Dhamodharan", department: "ECE", year: "III" },
      { fullName: "Thiraneesh", department: "ECE", year: "II" },
      { fullName: "Pradeep N", department: "AIDS", year: "IV" },
      { fullName: "Kishore", department: "IT", year: "IV" },
      { fullName: "Ram Prasanth K", department: "MECH", year: "III" },
      { fullName: "Vishnu G", department: "CSE", year: "III" },
      { fullName: "Kaviya Dharshini D", department: "AGRI", year: "IV" },
    ],
  },
  {
    name: "Literary Club",
    slug: "literary-club",
    description: "Runs debate, quiz, creative-writing and public-speaking initiatives across campus.",
    members: [
      { fullName: "Nithya Shree", department: "CSE", year: "III" },
      { fullName: "Anjali", department: "CSE", year: "II" },
      { fullName: "Gopika", department: "CSE", year: "II" },
      { fullName: "Pavithra", department: "AIDS", year: "III" },
      { fullName: "Ruba Sri", department: "CSE", year: "II" },
    ],
  },
  {
    name: "Public Relations & Social Media",
    slug: "public-relations-social-media",
    description: "Manages council branding, social channels, press coverage and external communication.",
    members: [
      { fullName: "Vivek", department: "CSE", year: "III" },
      { fullName: "Deepak", department: "CSE", year: "III" },
      { fullName: "Sanjay Sk", department: "CSE", year: "III" },
      { fullName: "Ashwanth", department: "CSE", year: "III" },
      { fullName: "Ashwinth", department: "IT", year: "IV" },
      { fullName: "Gowthaman", department: "MECH", year: "III" },
      { fullName: "Rishikanth", department: "CSE", year: "III" },
      { fullName: "Harish U", department: "CSE", year: "III" },
      { fullName: "Pushkalan", department: "CSE", year: "II" },
      { fullName: "Karthikeyan", department: "MECH", year: "II" },
    ],
  },
  {
    name: "Social Service",
    slug: "social-service",
    description: "Coordinates outreach, NSS collaborations and community-service initiatives.",
    members: [
      { fullName: "Nisha D", department: "AIDS", year: "III" },
      { fullName: "Mohammed Arsath", department: "ECE", year: "III" },
      { fullName: "Hari Sakthi", department: "IT", year: "II" },
      { fullName: "Lavanya", department: "CSE", year: "II" },
      { fullName: "Vedha Nayaki", department: "AIDS", year: "III" },
      { fullName: "Vijay Kumar", department: "MECH", year: "III" },
      { fullName: "Gayathri K", department: "CSE", year: "III" },
      { fullName: "Dhatchayani", department: "IT", year: "II" },
      { fullName: "Sri Ram", department: "MECH", year: "III" },
    ],
  },
  {
    name: "Student Welfare",
    slug: "student-welfare",
    description: "Handles student grievances, wellbeing programs and campus-life support.",
    members: [
      { fullName: "Keerthana", department: "AIDS", year: "II" },
      { fullName: "Rashika", department: "CSE", year: "III" },
      { fullName: "Deva Sri", department: "BME", year: "II" },
      { fullName: "Krithika", department: "IT", year: "III" },
      { fullName: "Thiruvarasi", department: "CSE", year: "III" },
      { fullName: "Santhiya Sri", department: "CSE", year: "II" },
      { fullName: "Pradeepa", department: "CSE", year: "III" },
      { fullName: "Padma Shree", department: "ECE", year: "III" },
    ],
  },
  {
    name: "Finance & Sponsorship",
    slug: "finance-sponsorship",
    description: "Manages council budgeting, sponsorships and financial planning for events.",
    members: [
      { fullName: "Gayathri", department: "MECH", year: "III" },
      { fullName: "Udhaya Raga", department: "CSE", year: "III" },
      { fullName: "Rithika", department: "AIDS", year: "III" },
      { fullName: "Rashika", department: "AIDS", year: "III" },
      { fullName: "Bharathi", department: "CSE", year: "III" },
      { fullName: "Vairamuthu", department: "CSE", year: "II" },
      { fullName: "Srinitha", department: "CSE", year: "II" },
      { fullName: "Dhanush", department: "MECH", year: "II" },
    ],
  },
  {
    name: "Event Management",
    slug: "event-management",
    description: "Plans and executes flagship council events end-to-end, from logistics to on-ground delivery.",
    members: [
      { fullName: "Aadhishree", department: "CSE", year: "II" },
      { fullName: "Dhanu Shree", department: "CSE", year: "III" },
      { fullName: "Kopisha", department: "CSE", year: "II" },
      { fullName: "Vigneshwaran", department: "BME", year: "IV" },
      { fullName: "Santhoshini", department: "CSE", year: "III" },
      { fullName: "Praveen", department: "CSE", year: "II" },
      { fullName: "Palani selvan", department: "CSE", year: "II" },
      { fullName: "Manoj", department: "CSE", year: "II" },
      { fullName: "Goushik Gokul", department: "AIDS", year: "III" },
      { fullName: "Blesswin Resibalan", department: "AIML", year: "II" },
    ],
  },
];
