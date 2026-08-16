import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, GraduationCap, Building2, Calendar, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}
export default async function ApplicationProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: app, error } = await supabase
    .from('applications')
    .select(`
      *,
      profiles!applications_assigned_counsellor_fkey(full_name),
      students(first_name, last_name, email)
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !app) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/applications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {app.university_name || 'Unknown University'}
              </h1>
              <Badge 
                variant={
                  app.status === 'accepted' ? 'default' : 
                  app.status === 'rejected' ? 'destructive' : 
                  app.status === 'submitted' ? 'secondary' : 
                  'outline'
                }
              >
                {app.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <GraduationCap className="h-4 w-4" /> {app.course_name || 'Course not specified'} • {app.intake_term || 'Intake not specified'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> University
                  </p>
                  <p>{app.university_name || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Submission Date
                  </p>
                  <p>{app.submission_date ? new Date(app.submission_date).toLocaleDateString() : 'Not submitted yet'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Decision Date
                  </p>
                  <p>{app.decision_date ? new Date(app.decision_date).toLocaleDateString() : 'Pending decision'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applicant</CardTitle>
            </CardHeader>
            <CardContent>
              {app.students ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    {/* @ts-expect-error - type mismatch */}
                    <p className="font-medium">{app.students.first_name} {app.students.last_name}</p>
                    {/* @ts-expect-error - type mismatch */}
                    <p className="text-xs text-muted-foreground">{app.students.email}</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No applicant linked.
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/students/${app.student_id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Counsellor</CardTitle>
            </CardHeader>
            <CardContent>
              {/* @ts-expect-error - type mismatch */}
              {app.profiles?.full_name ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-sm font-semibold text-primary">
                      {/* @ts-expect-error - type mismatch */}
                      {app.profiles.full_name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    {/* @ts-expect-error - type mismatch */}
                    <p className="font-medium">{app.profiles.full_name}</p>
                    <p className="text-xs text-muted-foreground">Lead Counsellor</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground mb-4">
                  No team member assigned yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
