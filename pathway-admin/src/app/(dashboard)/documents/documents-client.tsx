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
  Plus,
  Trash2,
  FileCheck2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const DELETED_DOCS_KEY = "pathway_deleted_documents"

function getDeletedDocIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_DOCS_KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {}
  return new Set()
}

function persistDeletedDocId(id: string) {
  try {
    const existing = getDeletedDocIds()
    existing.add(id)
    localStorage.setItem(DELETED_DOCS_KEY, JSON.stringify(Array.from(existing)))
  } catch {}
}

export function DocumentsClientView() {
  const [documents, setDocuments] = React.useState<StudentDocument[]>(() => {
    if (typeof window === "undefined") return INITIAL_DOCUMENTS
    const deleted = getDeletedDocIds()
    return INITIAL_DOCUMENTS.filter((d) => !deleted.has(d.id))
  })
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
    if (!newDoc.fileName) {
      toast.error("Please enter a file name")
      return
    }
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
      notes: newDoc.notes || "Uploaded by counsellor for compliance check."
    }
    setDocuments([doc, ...documents])
    setShowUploadModal(false)
    setNewDoc({})
    toast.success("Document uploaded successfully")
  }

  const handleDeleteDocument = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete document "${name}"?`)) {
      return
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    persistDeletedDocId(id);
    toast.success(`Document "${name}" deleted`)
  }

  const approvedCount = documents.filter(d => d.status === "Approved").length
  const pendingCount = documents.filter(d => d.status === "Under Review").length
  const rejectedCount = documents.filter(d => d.status === "Rejected").length

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Document Vault &amp; Verification
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 text-[#FF8A35] text-xs font-bold border border-orange-500/30">
              {documents.length} Files Managed
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Student KYC, passports, academic transcripts, financial affidavits, and CAS/visa documentation.
          </p>
        </div>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-950/40 h-9 px-4"
        >
          <Upload className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      {/* Completion % Overview by Student */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {INITIAL_STUDENTS.slice(0, 3).map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 space-y-2 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8F5F1] truncate">{s.name}</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{s.documentProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#1D1510] overflow-hidden border border-white/[0.08]">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${s.documentProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-[#897B70] truncate">
              Target: <strong className="text-[#BDB0A4]">{s.destination}</strong> ({s.course})
            </p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#897B70]" />
            <input
              placeholder="Search by student name or document file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-9 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Categories</option>
              <option value="Passport" className="bg-[#1D1510]">Passport</option>
              <option value="Academic transcripts" className="bg-[#1D1510]">Academic transcripts</option>
              <option value="English test" className="bg-[#1D1510]">English test</option>
              <option value="Financial documents" className="bg-[#1D1510]">Financial documents</option>
              <option value="SOP" className="bg-[#1D1510]">SOP</option>
              <option value="Visa documents" className="bg-[#1D1510]">Visa documents</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Statuses</option>
              <option value="Approved" className="bg-[#1D1510]">Approved ({approvedCount})</option>
              <option value="Under Review" className="bg-[#1D1510]">Under Review ({pendingCount})</option>
              <option value="Requested" className="bg-[#1D1510]">Requested</option>
              <option value="Rejected" className="bg-[#1D1510]">Rejected ({rejectedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents High-Density Data Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#18120D] text-[#897B70] uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3.5 px-4">Document File</th>
                <th className="py-3.5 px-3">Student Name</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Uploaded Date</th>
                <th className="py-3.5 px-3">Expiry Date</th>
                <th className="py-3.5 px-3">Verification Status</th>
                <th className="py-3.5 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#897B70]">
                    No documents found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#F8F5F1] truncate max-w-xs">{doc.fileName}</p>
                          <span className="text-[10px] text-[#897B70] font-mono">{doc.fileSize}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-[#F8F5F1] whitespace-nowrap">
                      {doc.studentName}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#1D1510] text-[#BDB0A4] text-xs font-medium border border-white/[0.08]">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-[#897B70] font-mono">
                      {doc.uploadDate}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-[#897B70] font-mono">
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
                            className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-2.5 shadow-sm"
                          >
                            Approve
                          </Button>
                        )}
                        {doc.status !== "Rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVerify(doc.id, "Rejected")}
                            className="h-7 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg px-2"
                          >
                            Reject
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                          className="h-7 w-7 p-0 text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[480px] bg-[#15100D] border border-white/[0.12] text-[#F8F5F1] shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#F8F5F1] font-bold text-base flex items-center gap-2">
              <Upload className="h-4 w-4 text-[#FF6B00]" /> Upload Student Document
            </DialogTitle>
            <DialogDescription className="text-xs text-[#897B70]">
              Attach proof of identity, transcripts, or financial verification records.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#BDB0A4]">Student Name</Label>
              <Input
                placeholder="e.g. Zainab Al-Mansoor"
                value={newDoc.studentName || ""}
                onChange={(e) => setNewDoc({ ...newDoc, studentName: e.target.value })}
                className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#BDB0A4]">Category</Label>
              <select
                value={newDoc.category || "Academic transcripts"}
                onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                className="w-full h-9 rounded-xl border border-white/[0.1] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
              >
                <option value="Passport" className="bg-[#1D1510]">Passport</option>
                <option value="Academic transcripts" className="bg-[#1D1510]">Academic transcripts</option>
                <option value="English test" className="bg-[#1D1510]">English test</option>
                <option value="Financial documents" className="bg-[#1D1510]">Financial documents</option>
                <option value="SOP" className="bg-[#1D1510]">SOP</option>
                <option value="Visa documents" className="bg-[#1D1510]">Visa documents</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#BDB0A4]">File Name</Label>
              <Input
                placeholder="e.g. Degree_Certificate_Verified.pdf"
                value={newDoc.fileName || ""}
                onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#BDB0A4]">Internal Notes</Label>
              <Input
                placeholder="Optional verification instructions or notes"
                value={newDoc.notes || ""}
                onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowUploadModal(false)}
                className="text-xs text-[#897B70] hover:text-[#F8F5F1] rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Upload &amp; Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
