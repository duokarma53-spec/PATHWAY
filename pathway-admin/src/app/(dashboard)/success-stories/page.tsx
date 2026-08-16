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
// import Link from 'next/link'

export default async function SuccessStoriesPage() {
  const supabase = await createClient()

  const { data: stories, error } = await supabase
    .from('success_stories')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Success Stories</h1>
          <p className="text-muted-foreground">
            Manage student success stories and testimonials.
          </p>
        </div>
        <GenericAddButton title="Add Story" entityName="Story" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Success Stories</CardTitle>
          <CardDescription>
            Highlighted alumni stories shown on the public website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load success stories. ({error.message})
             </div>
          ) : stories?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No success stories found.
             </div>
          ) : (
            <div className="overflow-x-auto -mx-1"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories?.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {story.display_order}
                    </TableCell>
                    <TableCell className="font-medium">
                      {story.student_name}
                    </TableCell>
                    <TableCell>
                      {story.university}
                    </TableCell>
                    <TableCell>
                      <Badge variant={story.is_published ? 'default' : 'secondary'}>
                        {story.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
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
