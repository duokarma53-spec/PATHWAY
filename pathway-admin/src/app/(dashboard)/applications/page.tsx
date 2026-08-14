import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ApplicationsPage() {
  const supabase = await createClient()

  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      id, 
      university_name, 
      course_name, 
      intake_term, 
      status, 
      submission_date,
      students(first_name, last_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications Pipeline</h1>
          <p className="text-muted-foreground">
            Track student applications across universities.
          </p>
        </div>
        <Button asChild>
          <Link href="/applications/new">
            <Plus className="mr-2 h-4 w-4" /> New Application
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            A list of all active applications in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load applications. ({error.message})
             </div>
          ) : applications?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No applications found.
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Intake</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {/* @ts-ignore */}
                      {app.students?.first_name} {app.students?.last_name}
                    </TableCell>
                    <TableCell>{app.university_name || 'N/A'}</TableCell>
                    <TableCell>{app.course_name || 'N/A'}</TableCell>
                    <TableCell>{app.intake_term || 'N/A'}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/applications/${app.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
