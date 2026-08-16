import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, Calendar, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
}
export default async function LeadProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .select(`
      *,
      profiles!leads_assigned_to_fkey(full_name)
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error || !lead) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/leads">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {lead.first_name} {lead.last_name}
              </h1>
              <Badge 
                variant={
                  lead.status === 'new' ? 'destructive' : 
                  lead.status === 'converted' ? 'default' : 
                  'outline'
                }
              >
                {lead.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              Enquiry Type: <span className="capitalize text-foreground font-medium">{lead.inquiry_type?.replace('_', ' ') || 'General'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lead.status !== 'converted' && (
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Convert to Student
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enquiry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p>{lead.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone
                  </p>
                  <p>{lead.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Submitted On
                  </p>
                  <p>{new Date(lead.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                <div className="p-4 bg-muted/30 rounded-md border text-sm whitespace-pre-wrap">
                  {lead.message || 'No message provided.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* @ts-expect-error - type mismatch */}
              {lead.profiles?.full_name ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-sm font-semibold text-primary">
                      {/* @ts-expect-error - type mismatch */}
                      {lead.profiles.full_name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    {/* @ts-expect-error - type mismatch */}
                    <p className="font-medium">{lead.profiles.full_name}</p>
                    <p className="text-xs text-muted-foreground">Assigned Team Member</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground mb-4">
                  No team member assigned yet.
                </div>
              )}
              <Button variant="outline" className="w-full mt-4">Change Assignment</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
