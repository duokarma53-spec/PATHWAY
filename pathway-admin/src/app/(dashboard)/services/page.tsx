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

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('order_num', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage the consultancy services offered to students.
          </p>
        </div>
        <GenericAddButton title="Add Service" entityName="Service" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            Services appear on the public website based on display order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load services. ({error.message})
             </div>
          ) : services?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No services found.
             </div>
          ) : (
            <div className="overflow-x-auto -mx-1"><Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Service Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {service.order_num}
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.is_published ? 'default' : 'secondary'}>
                        {service.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(service.updated_at).toLocaleDateString()}
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
