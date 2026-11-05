import DashboardLayout from "../components/dashboard/DashboardLayout";

/**
 * Dashboard Page
 * 
 * Houses the professional Pathwise Dashboard system including:
 * - Expandable/Collapsible Left-Side Navigation Menu (8 items)
 * - Top Navigation Bar with Dynamic Titles, Notifications & User Profile Dropdown
 * - Dashboard Home with Welcome Section, 4 KPI Information Cards, and Diagnostic Benchmark Engine
 * - My Roadmap personalized timeline
 * - Notifications system with unread count
 * - Certifications management (add/edit/delete/upload)
 * - Personal Details viewer and editor
 * - Help & Support with FAQs, Contact, Report, and Feedback
 * - Settings with Account, Preferences, and Security
 * - Logout confirmation dialog
 */
export default function Dashboard() {
  return <DashboardLayout />;
}
