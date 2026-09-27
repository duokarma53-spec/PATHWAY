"use client"

import * as React from "react"
import {
  FolderOpen,
  FileText,
  Search,
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  ShieldCheck,
  Calendar,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, DocumentStatus } from "@/components/ui/status-badge"
import { INITIAL_DOCUMENTS, INITIAL_STUDENTS, StudentDocument } from "@/lib/mock-data"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function DocumentsClientView() {
  const [documents, setDocuments] = React.useState<StudentDocument[]>(INITIAL_DOCUMENTS)
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [showUploadModal, setShowUploadModal] = React.useState(false)
  const [newDoc, setNewDoc] = React.useState<Partial<StudentDocument>>({})

  const filteredDocs = React.useMemo(() => {
    return documents.filter((d) => {
      const matchSearch =
        search === "" ||
        d.fileName.toLowerCase().includes(search.toLowerCase()) ||
        d.studentName.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase())

      const matchCategory = categoryFilter === "ALL" || d.category === categoryFilter
      const matchStatus = statusFilter === "ALL" || d.status === statusFilter

      return matchSearch && matchCategory && matchStatus
    })
  }, [documents, search, categoryFilter, statusFilter])

  const handleVerify = (docId: string, status: "Approved" | "Rejected") => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, status, verified: status === "Approved" } : d
      )
    )
    toast.success(`Document marked as ${status}`)
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDoc.fileName) return
    const doc: StudentDocument = {
      id: "doc-" + Date.now(),
      studentId: "stu-1",
      studentName: newDoc.studentName || "Zainab Al-Mansoor",
      category: (newDoc.category as any) || "Academic transcripts",
      fileName: newDoc.fileName || "Uploaded_Document.pdf",
      fileSize: "2.1 MB",
      uploadDate: new Date().toISOString().slice(0, 10),
      status: "Under Review",
      verified: false,
      notes: "Uploaded by counsellor for compliance check."
    }
    setDocuments([doc, ...documents])
    setShowUploadModal(false)
    setNewDoc({})
    toast.success("Document uploaded successfully")
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Document Verification & Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              {documents.length} Records
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Student KYC, passports, academic transcripts, financial affidavits, and CAS/visa documentation.
          </p>
        </div>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
        >
          <Upload className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      {/* Completion % Overview by Student */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {INITIAL_STUDENTS.slice(0, 3).map((s) => (
          <Card key={s.id} className="border-border/60 bg-card/75 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground truncate">{s.name}</span>
              <span className="text-xs font-bold text-emerald-400">{s.documentProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/60 overflow-hidden border border-border/30">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${s.documentProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Target: {s.destination} ({s.course})
            </p>
          </Card>
        ))}
      </div>

      {/* Filter and Search */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or document file name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Passport">Passport</option>
                <option value="Academic transcripts">Academic transcripts</option>
                <option value="English test">English test</option>
                <option value="Financial documents">Financial documents</option>
                <option value="SOP">SOP</option>
                <option value="Visa documents">Visa documents</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Requested">Requested</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4">Document File</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Uploaded Date</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Verification Status</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground truncate max-w-xs">{doc.fileName}</p>
                        <span className="text-[10px] text-muted-foreground">{doc.fileSize}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-foreground whitespace-nowrap">
                    {doc.studentName}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-muted/60 text-foreground text-xs font-medium border border-border/40">
                      {doc.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap text-muted-foreground">
                    {doc.uploadDate}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap text-muted-foreground font-mono">
                    {doc.expiryDate || "—"}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={doc.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {doc.status !== "Approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(doc.id, "Approved")}
                          className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-2.5"
                        >
                          Approve
                        </Button>
                      )}
                      {doc.status !== "Rejected" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVerify(doc.id, "Rejected")}
                          className="h-7 text-xs text-destructive hover:bg-destructive/10 rounded-lg px-2"
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleUploadSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <Upload className="h-5 w-5" /> Upload & Verify Student File
              </DialogTitle>
              <DialogDescription>
                Tag an incoming document to an enrolled student.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="docStu" className="text-xs">Student Name</Label>
                <select
                  id="docStu"
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                  onChange={(e) => setNewDoc({ ...newDoc, studentName: e.target.value })}
                >
                  <option value="Zainab Al-Mansoor">Zainab Al-Mansoor</option>
                  <option value="Arjun Nair">Arjun Nair</option>
                  <option value="Sneha Mukherjee">Sneha Mukherjee</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="docCat" className="text-xs">Category</Label>
                <select
                  id="docCat"
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                >
                  <option value="Passport">Passport</option>
                  <option value="Academic transcripts">Academic transcripts</option>
                  <option value="English test">English test</option>
                  <option value="Financial documents">Financial documents</option>
                  <option value="SOP">SOP</option>
                  <option value="Visa documents">Visa documents</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="docName" className="text-xs">File Name / Label *</Label>
                <Input
                  id="docName"
                  required
                  placeholder="e.g. Bank_Statement_6Months.pdf"
                  onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Upload File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
