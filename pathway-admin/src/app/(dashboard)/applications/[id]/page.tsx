import { INITIAL_APPLICATIONS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArrowLeft, Building2, Calendar, GraduationCap, DollarSign, UserCheck } from "lucide-react"
import Link from "next/link"

export function generateStaticParams() {
  return INITIAL_APPLICATIONS.map((a) => ({ id: a.id }))
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const app = INITIAL_APPLICATIONS.find(a => a.id === resolvedParams.id)

  if (!app) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16 text-center py-16">
        <h2 className="text-xl font-bold text-foreground">Application Not Found</h2>
        <p className="text-sm text-muted-foreground">This application does not exist or has been removed.</p>
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/applications">Back to Applications</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-muted/50 text-xs">
          <Link href="/applications" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to Applications
          </Link>
        </Button>
        <span className="text-muted-foreground/40">•</span>
        <span className="text-xs text-muted-foreground font-mono">{app.applicationCode}</span>
      </div>

      <Card className="border-border/60 bg-card/85 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-foreground">{app.university}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {app.course} • {app.country} • Intake: <strong className="text-primary">{app.intake}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-muted-foreground">Tuition Fee:</span>
            <p className="text-lg font-bold text-foreground">{app.fees}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60 bg-card/75 p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" /> Applicant Details
          </h3>
          <div className="text-xs space-y-1">
            <p className="text-muted-foreground">Student Name:</p>
            <p className="font-semibold text-foreground text-sm">{app.studentName}</p>
            <p className="text-muted-foreground pt-2">Assigned Counsellor:</p>
            <p className="font-semibold text-foreground">{app.counsellor}</p>
          </div>
        </Card>

        <Card className="border-border/60 bg-card/75 p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" /> Milestones & Decisions
          </h3>
          <div className="text-xs space-y-1">
            <p className="text-muted-foreground">Offer Decision:</p>
            <p className="font-semibold text-foreground">{app.offerStatus}</p>
            <p className="text-muted-foreground pt-2">Deposit Status:</p>
            <p className="font-semibold text-foreground">{app.depositStatus}</p>
            <p className="text-muted-foreground pt-2">Application Deadline:</p>
            <p className="font-semibold text-amber-400 font-mono">{app.deadline}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
