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
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DestinationsPage() {
  const supabase = await createClient()

  const { data: destinations, error } = await supabase
    .from('destinations')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
          <p className="text-muted-foreground">
            Manage study abroad destinations displayed on the website.
          </p>
        </div>
        <GenericAddButton title="Add Destination" entityName="Destination" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Destinations</CardTitle>
          <CardDescription>
            Active and inactive destination profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load destinations. ({error.message})
             </div>
          ) : destinations?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No destinations found.
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations?.map((dest) => (
                  <TableRow key={dest.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <span className="text-lg">{dest.flag}</span>
                      {dest.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={dest.is_published ? 'default' : 'secondary'}>
                        {dest.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(dest.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
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
