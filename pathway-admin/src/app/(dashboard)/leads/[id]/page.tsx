import { LeadDetailClient } from "./lead-detail-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Lead Profile | Pathway CRM",
  description: "Comprehensive prospective student profile, history, study preferences and timeline.",
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <LeadDetailClient leadId={resolvedParams.id} />
}
