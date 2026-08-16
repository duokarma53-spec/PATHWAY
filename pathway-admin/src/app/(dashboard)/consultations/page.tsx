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

export default async function ConsultationsPage() {
  const supabase = await createClient()

  const { data: consultations, error } = await supabase
    .from('consultations')
    .select(`*`)
    .order('preferred_date', { ascending: false })
    .order('preferred_time', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">
            Manage upcoming and past student consultation requests.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>
            All consultation bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load consultations. ({error.message})
             </div>
          ) : consultations?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No consultations found.
             </div>
          ) : (
            <div className="overflow-x-auto -mx-1"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Preferred Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations?.map((cons) => (
                  <TableRow key={cons.id}>
                    <TableCell className="font-medium">
                      {cons.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{cons.email}</span>
                        <span className="text-muted-foreground">{cons.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>{cons.preferred_date ? new Date(cons.preferred_date).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{cons.preferred_time || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          cons.status === 'confirmed' ? 'default' : 
                          cons.status === 'cancelled' ? 'destructive' : 
                          cons.status === 'pending' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {cons.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Manage
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
