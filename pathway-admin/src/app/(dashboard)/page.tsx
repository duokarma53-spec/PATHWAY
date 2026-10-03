import { DashboardClientView } from "./dashboard-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Pathway CRM | Executive Consultancy Dashboard",
  description: "Comprehensive operations, student pipeline, and lead management platform.",
}

export default function DashboardPage() {
  return <DashboardClientView />
}

