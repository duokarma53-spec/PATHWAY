import { LeadDetailClient } from "./lead-detail-client"
import { INITIAL_LEADS } from "@/lib/mock-data"

export function generateStaticParams() {
  return INITIAL_LEADS.map((l) => ({ id: l.id }))
}

export const metadata = {
  title: "Lead Profile | Pathway CRM",
  description: "Comprehensive prospective student profile, history, study preferences and timeline.",
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <LeadDetailClient leadId={resolvedParams.id} />
}
