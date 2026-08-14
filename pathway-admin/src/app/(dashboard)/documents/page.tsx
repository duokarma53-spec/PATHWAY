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
import { Upload, FileText, Download } from 'lucide-react'
import Link from 'next/link'

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      id,
      file_name,
      document_type,
      status,
      created_at,
      students(first_name, last_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage student uploads, transcripts, and application materials.
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            All files uploaded across the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
             <div className="text-sm text-destructive font-medium p-4 border border-destructive/20 rounded bg-destructive/10">
               Failed to load documents. ({error.message})
             </div>
          ) : documents?.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg flex flex-col items-center gap-2">
               <FileText className="h-8 w-8 text-muted-foreground/50" />
               <p>No documents found.</p>
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {doc.file_name}
                    </TableCell>
                    <TableCell>
                      {doc.document_type}
                    </TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      {doc.students ? `${doc.students.first_name} ${doc.students.last_name}` : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          doc.status === 'verified' ? 'default' : 
                          doc.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {doc.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(doc.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
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
