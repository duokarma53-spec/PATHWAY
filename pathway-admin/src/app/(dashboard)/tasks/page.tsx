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

export default async function TasksPage() {
  const supabase = await createClient()

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      due_date,
      priority,
      status,
      students(first_name, last_name),
      profiles!tasks_assigned_to_fkey(full_name)
    `)
    .order('due_date', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your daily tasks and follow-ups.
          </p>
        </div>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>
            Tasks assigned to you or your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load tasks. ({error.message})
             </div>
          ) : tasks?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No tasks found. Take a break!
             </div>
          ) : (
            <div className="overflow-x-auto -mx-1"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Related To</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks?.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {task.priority === 'high' && (
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                        )}
                        {task.priority === 'medium' && (
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                        )}
                        {task.priority === 'low' && (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                        {task.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* @ts-expect-error - type mismatch */}
                      {task.students ? `${task.students.first_name} ${task.students.last_name}` : 'General'}
                    </TableCell>
                    <TableCell>
                      {/* @ts-expect-error - type mismatch */}
                      {task.profiles?.full_name || 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          task.status === 'completed' ? 'default' : 
                          task.status === 'in_progress' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
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
