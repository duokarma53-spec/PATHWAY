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

export default async function FAQsPage() {
  const supabase = await createClient()

  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQs</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions displayed on the website.
          </p>
        </div>
        <GenericAddButton title="Add FAQ" entityName="FAQ" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All FAQs</CardTitle>
          <CardDescription>
            Grouped by category and sorted by display order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load FAQs. ({error.message})
             </div>
          ) : faqs?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
               No FAQs found.
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs?.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {faq.category}
                    </TableCell>
                    <TableCell className="font-medium max-w-[400px] truncate">
                      {faq.question}
                    </TableCell>
                    <TableCell>
                      <Badge variant={faq.is_published ? 'default' : 'secondary'}>
                        {faq.is_published ? 'Published' : 'Draft'}
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
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
