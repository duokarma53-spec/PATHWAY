import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Mail, Phone, MapPin, GraduationCap, Calendar } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('students')
    .select(`
      *,
      profiles!students_assigned_counsellor_fkey(full_name)
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !student) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/students">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {student.first_name} {student.last_name}
              </h1>
              <Badge 
                variant={
                  student.status === 'active' ? 'default' : 
                  student.status === 'enrolled' ? 'secondary' : 
                  'outline'
                }
              >
                {student.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Mail className="h-3 w-3" /> {student.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone
                  </p>
                  <p>{student.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location
                  </p>
                  <p>{[student.city, student.country].filter(Boolean).join(', ') || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Current Institution
                  </p>
                  <p>{student.current_institution || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Registered
                  </p>
                  <p>{new Date(student.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {student.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Initial Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{student.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications Pipeline</CardTitle>
              <CardDescription>University applications for this student.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                Applications module not yet implemented.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Counsellor</CardTitle>
            </CardHeader>
            <CardContent>
              {/* @ts-ignore */}
              {student.profiles?.full_name ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-sm font-semibold text-primary">
                      {/* @ts-ignore */}
                      {student.profiles.full_name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    {/* @ts-ignore */}
                    <p className="font-medium">{student.profiles.full_name}</p>
                    <p className="text-xs text-muted-foreground">Primary Counsellor</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No counsellor assigned.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
                <p>{student.grade_level || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Academic Score</p>
                <p>{student.academic_score || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">English Test</p>
                <p>{student.english_test_score || '—'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
