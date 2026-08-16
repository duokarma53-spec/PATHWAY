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
import { GenericAddButton } from '@/components/actions/quick-actions'
import {} from 'lucide-react'
import Link from 'next/link'

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('students')
    .select(`
      id, 
      first_name, 
      last_name, 
      email, 
      status, 
      country,
      profiles!students_assigned_counsellor_fkey(full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage your student pipeline and profiles.
          </p>
        </div>
        <GenericAddButton title="Add Student" entityName="Student" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            A list of all students currently in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load students. Ensure the database schema is applied. ({error.message})
             </div>
          ) : students?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No students found. Add your first student to get started.
             </div>
          ) : (
            <div className="overflow-x-auto -mx-1"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Counsellor</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.country || '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          student.status === 'active' ? 'default' : 
                          student.status === 'enrolled' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* @ts-expect-error - type mismatch */}
                      {student.profiles?.full_name || 'Unassigned'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/students/${student.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
