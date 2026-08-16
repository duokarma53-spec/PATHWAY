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

export default async function UniversitiesPage() {
  const supabase = await createClient()

  const { data: universities, error } = await supabase
    .from('universities')
    .select(`
      id,
      name,
      country,
      rank,
      is_featured,
      destinations(name)
    `)
    .order('name', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
          <p className="text-muted-foreground">
            Manage partner universities and their programs.
          </p>
        </div>
        <GenericAddButton title="Add University" entityName="University" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Universities</CardTitle>
          <CardDescription>
            Database of universities shown in the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load universities. ({error.message})
             </div>
          ) : universities?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No universities found.
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University Name</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities?.map((uni) => (
                  <TableRow key={uni.id}>
                    <TableCell className="font-medium">
                      {uni.name}
                    </TableCell>
                    <TableCell>
                      {/* @ts-expect-error - type mismatch */}
                      {uni.destinations?.name || uni.country}
                    </TableCell>
                    <TableCell>
                      {uni.rank ? `#${uni.rank}` : '-'}
                    </TableCell>
                    <TableCell>
                      {uni.is_featured ? (
                        <Badge variant="default">Featured</Badge>
                      ) : (
                        <Badge variant="outline">Standard</Badge>
                      )}
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
