/**
 * Mock data for the Student Career Dashboard and Skill Gap Analysis.
 * Adheres strictly to the Pathwise Shared Data Contract (v1.0, Milestone 2).
 * 
 * Proficiency Scale:
 *   0 - No knowledge
 *   1 - Beginner
 *   2 - Basic
 *   3 - Intermediate
 *   4 - Advanced
 *   5 - Proficient
 *
 * Gap formula: max(required_level - current_level, 0)
 * Priorities:
 *   gap 0-1: Low
 *   gap 2:   Medium
 *   gap 3:   High
 *   gap 4-5: Critical
 */

export const PROFICIENCY_LEVELS = {
  0: { label: "No knowledge", short: "None", color: "text-slate-400", bg: "bg-slate-100" },
  1: { label: "Beginner", short: "Beg", color: "text-amber-600", bg: "bg-amber-50" },
  2: { label: "Basic", short: "Basic", color: "text-blue-600", bg: "bg-blue-50" },
  3: { label: "Intermediate", short: "Inter", color: "text-indigo-600", bg: "bg-indigo-50" },
  4: { label: "Advanced", short: "Adv", color: "text-purple-600", bg: "bg-purple-50" },
  5: { label: "Proficient", short: "Prof", color: "text-emerald-600", bg: "bg-emerald-50" },
};

export const MOCK_STUDENT = {
  id: 1,
  name: "Rahul Sharma",
  email: "rahul@example.com",
  education: "B.Tech CSE, 2nd Year",
  career_goal: "Frontend Developer",
  joined_date: "August 2024",
  avatar_initials: "RS",
};

export const MOCK_DASHBOARD_DATA = {
  student_id: 1,
  career_id: "frontend_developer",
  career: "Frontend Developer",
  career_description: "Builds user-facing web applications with modern frameworks, responsive design, and intuitive user experiences.",
  readiness_score: 65,
  skills: [
    {
      name: "HTML",
      category: "technical",
      current_level: 4,
      required_level: 4,
      gap: 0,
      priority: "Low",
      importance: "Provides structural backbone of web pages.",
      weight: 0.9,
    },
    {
      name: "CSS & Responsive Design",
      category: "technical",
      current_level: 3,
      required_level: 4,
      gap: 1,
      priority: "Low",
      importance: "Styling, modern layout systems (Flexbox/Grid), and multi-device support.",
      weight: 0.9,
    },
    {
      name: "JavaScript",
      category: "technical",
      current_level: 2,
      required_level: 5,
      gap: 3,
      priority: "High",
      importance: "Essential for building interactive, asynchronous web applications.",
      weight: 1.0,
    },
    {
      name: "React",
      category: "technical",
      current_level: 0,
      required_level: 4,
      gap: 4,
      priority: "Critical",
      importance: "Core frontend library for modular single-page component architectures.",
      weight: 0.9,
    },
    {
      name: "TypeScript",
      category: "technical",
      current_level: 1,
      required_level: 3,
      gap: 2,
      priority: "Medium",
      importance: "Ensures type safety, maintainability, and enterprise-grade scalability.",
      weight: 0.7,
    },
    {
      name: "Git & Version Control",
      category: "technical",
      current_level: 3,
      required_level: 3,
      gap: 0,
      priority: "Low",
      importance: "Version tracking, branch workflows, and team collaboration.",
      weight: 0.8,
    },
    {
      name: "REST API Integration",
      category: "technical",
      current_level: 2,
      required_level: 4,
      gap: 2,
      priority: "Medium",
      importance: "Connecting client applications to backends via HTTP/JSON protocols.",
      weight: 0.8,
    },
    {
      name: "Web Performance & SEO",
      category: "technical",
      current_level: 0,
      required_level: 2,
      gap: 2,
      priority: "Medium",
      importance: "Optimizing Core Web Vitals, asset bundling, and lighthouse scores.",
      weight: 0.6,
    },
    {
      name: "Testing & Debugging",
      category: "technical",
      current_level: 0,
      required_level: 3,
      gap: 3,
      priority: "High",
      importance: "Unit testing, Chrome DevTools debugging, and end-to-end reliability.",
      weight: 0.7,
    },
    {
      name: "Team Collaboration",
      category: "professional",
      current_level: 4,
      required_level: 3,
      gap: 0,
      priority: "Low",
      importance: "Cross-functional communication with design and product teams.",
      weight: 0.6,
    },
  ],
};

// Alternative career mocks to test role switching smoothly
export const MOCK_ALTERNATIVE_CAREERS = [
  {
    id: "frontend_developer",
    name: "Frontend Developer",
    data: MOCK_DASHBOARD_DATA,
  },
  {
    id: "data_analyst",
    name: "Data Analyst",
    data: {
      student_id: 1,
      career_id: "data_analyst",
      career: "Data Analyst",
      career_description: "Transforms raw data into actionable business intelligence through modeling, SQL, and interactive dashboards.",
      readiness_score: 48,
      skills: [
        {
          name: "SQL",
          category: "technical",
          current_level: 3,
          required_level: 5,
          gap: 2,
          priority: "Medium",
          importance: "Querying relational databases, complex joins, and aggregations.",
          weight: 1.0,
        },
        {
          name: "Python (Pandas/NumPy)",
          category: "technical",
          current_level: 2,
          required_level: 4,
          gap: 2,
          priority: "Medium",
          importance: "Data manipulation, transformation, and exploratory data analysis.",
          weight: 0.9,
        },
        {
          name: "Data Visualization",
          category: "technical",
          current_level: 1,
          required_level: 4,
          gap: 3,
          priority: "High",
          importance: "Building dashboards in Tableau, PowerBI, or Matplotlib.",
          weight: 0.8,
        },
        {
          name: "Statistical Analysis",
          category: "technical",
          current_level: 2,
          required_level: 3,
          gap: 1,
          priority: "Low",
          importance: "Hypothesis testing, probability distributions, regression.",
          weight: 0.7,
        },
        {
          name: "Excel / Spreadsheets",
          category: "technical",
          current_level: 4,
          required_level: 4,
          gap: 0,
          priority: "Low",
          importance: "Pivot tables, VLOOKUP/XLOOKUP, and business modeling.",
          weight: 0.7,
        },
        {
          name: "Business Communication",
          category: "professional",
          current_level: 3,
          required_level: 4,
          gap: 1,
          priority: "Low",
          importance: "Presenting insights and recommendations to non-technical stakeholders.",
          weight: 0.8,
        },
      ],
    },
  },
  {
    id: "cloud_engineer",
    name: "Cloud Engineer",
    data: {
      student_id: 1,
      career_id: "cloud_engineer",
      career: "Cloud Engineer",
      career_description: "Architects, deploys, and manages scalable cloud infrastructure and CI/CD automation pipelines.",
      readiness_score: 35,
      skills: [
        {
          name: "Linux Fundamentals",
          category: "technical",
          current_level: 2,
          required_level: 4,
          gap: 2,
          priority: "Medium",
          importance: "Command line administration, bash scripting, and permissions.",
          weight: 0.9,
        },
        {
          name: "Docker & Containers",
          category: "technical",
          current_level: 1,
          required_level: 4,
          gap: 3,
          priority: "High",
          importance: "Containerizing services, multi-stage builds, and orchestration.",
          weight: 0.9,
        },
        {
          name: "AWS / Cloud Platforms",
          category: "technical",
          current_level: 0,
          required_level: 4,
          gap: 4,
          priority: "Critical",
          importance: "Core cloud architecture (EC2, S3, VPC, IAM, Lambda).",
          weight: 1.0,
        },
        {
          name: "CI/CD Pipelines",
          category: "technical",
          current_level: 1,
          required_level: 3,
          gap: 2,
          priority: "Medium",
          importance: "GitHub Actions, automated build pipelines, and releases.",
          weight: 0.8,
        },
        {
          name: "Networking Basics",
          category: "technical",
          current_level: 2,
          required_level: 3,
          gap: 1,
          priority: "Low",
          importance: "DNS, TCP/IP, subnetting, load balancers, and SSL/TLS.",
          weight: 0.7,
        },
      ],
    },
  },
];
