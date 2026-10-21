"use client"

import * as React from "react"
import {
  CreditCard,
  DollarSign,
  Search,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
  FileText,
  Trash2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import { INITIAL_PAYMENTS, PaymentRecord } from "@/lib/mock-data"
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

export function PaymentsClientView() {
  const [payments, setPayments] = React.useState<PaymentRecord[]>(INITIAL_PAYMENTS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newPay, setNewPay] = React.useState<Partial<PaymentRecord>>({})

  const filteredPayments = React.useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        search === "" ||
        p.studentName.toLowerCase().includes(search.toLowerCase()) ||
        p.invoiceRef.toLowerCase().includes(search.toLowerCase()) ||
        p.service.toLowerCase().includes(search.toLowerCase())

      const matchStatus = statusFilter === "ALL" || p.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [payments, search, statusFilter])

  // Financial aggregates
  const totalBilled = payments.reduce((acc, p) => acc + p.amount, 0)
  const totalPaid = payments.reduce((acc, p) => acc + p.amountPaid, 0)
  const totalPending = payments.reduce((acc, p) => acc + p.remaining, 0)
  const overdueCount = payments.filter((p) => p.status === "Overdue").length

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPay.studentName || !newPay.amount) return
    const amt = Number(newPay.amount) || 1000
    const paid = Number(newPay.amountPaid) || 0
    const rem = amt - paid
    const record: PaymentRecord = {
      id: "pay-" + Date.now(),
      invoiceRef: "INV-2026-" + Math.floor(100 + Math.random() * 900),
      studentId: "stu-1",
      studentName: newPay.studentName,
      service: newPay.service || "Consultancy Advisory Package",
      amount: amt,
      amountPaid: paid,
      remaining: rem,
      paymentDate: new Date().toISOString().slice(0, 10),
      method: (newPay.method as any) || "Bank Transfer",
      status: paid >= amt ? "Paid" : paid > 0 ? "Partial" : "Pending"
    }
    setPayments([record, ...payments])
    setShowAddModal(false)
    setNewPay({})
    toast.success(`Invoice ${record.invoiceRef} generated`)
  }

  const handleDeletePayment = (id: string, ref: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice "${ref}"?`)) {
      return
    }
    setPayments((prev) => prev.filter((p) => p.id !== id))
    toast.success(`Payment record "${ref}" deleted`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Invoice Ref", "Student", "Service", "Total Amount", "Amount Paid", "Remaining", "Date", "Method", "Status"]
    const rows = filteredPayments.map(p => [
      p.invoiceRef,
      `"${p.studentName}"`,
      `"${p.service}"`,
      p.amount,
      p.amountPaid,
      p.remaining,
      p.paymentDate,
      `"${p.method}"`,
      p.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `pathway_finance_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${filteredPayments.length} payment records`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8F5F1]">
              Payment &amp; Finance Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              ${totalPaid.toLocaleString()} Collected
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#BDB0A4] mt-1">
            Track student consultancy retainers, university application fees, and visa processing charges.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl border-white/[0.08] bg-[#15100D] hover:bg-[#1D1510] text-[#F8F5F1] text-xs h-9 px-3.5 flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-orange-400" /> Export Ledger
          </Button>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-950/40 h-9 px-4"
          >
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl space-y-1">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Total Invoiced</p>
          <p className="text-2xl font-bold text-[#F8F5F1] mt-1">${totalBilled.toLocaleString()}</p>
          <p className="text-[11px] text-[#897B70]">All contracts</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl space-y-1">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Total Collected</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">${totalPaid.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{((totalPaid / (totalBilled || 1)) * 100).toFixed(0)}% recovery rate</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl space-y-1">
          <p className="text-[11px] text-[#897B70] uppercase font-semibold">Outstanding Due</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">${totalPending.toLocaleString()}</p>
          <p className="text-[11px] text-[#897B70]">Pending receipts</p>
        </div>

        <div className={`rounded-2xl border p-4 backdrop-blur-md shadow-xl space-y-1 ${
          overdueCount > 0 ? "border-rose-500/30 bg-rose-500/[0.08]" : "border-white/[0.08] bg-[#15100D]/85"
        }`}>
          <p className="text-[11px] text-rose-400 uppercase font-semibold">Overdue Invoices</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{overdueCount}</p>
          <p className="text-[11px] text-rose-400/80">Requires collection follow-up</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 p-4 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#897B70]" />
            <input
              placeholder="Search invoices by student name, reference or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-9 rounded-xl bg-[#1D1510] border border-white/[0.08] text-xs text-[#F8F5F1] placeholder:text-[#897B70] outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-white/[0.08] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] font-medium outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1D1510]">All Statuses</option>
              <option value="Paid" className="bg-[#1D1510]">Paid</option>
              <option value="Partial" className="bg-[#1D1510]">Partial</option>
              <option value="Pending" className="bg-[#1D1510]">Pending</option>
              <option value="Overdue" className="bg-[#1D1510]">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments High-Density Data Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#15100D]/85 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#18120D] text-[#897B70] uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3.5 px-4">Invoice Reference</th>
                <th className="py-3.5 px-3">Student Name</th>
                <th className="py-3.5 px-3">Service Package</th>
                <th className="py-3.5 px-3">Total Billed</th>
                <th className="py-3.5 px-3">Amount Paid</th>
                <th className="py-3.5 px-3">Balance Due</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Method</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#897B70]">
                    No invoices found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-orange-400">
                      {p.invoiceRef}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-[#F8F5F1] whitespace-nowrap">
                      {p.studentName}
                    </td>

                    <td className="py-3.5 px-3 text-[#BDB0A4]">
                      {p.service}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-[#F8F5F1] font-mono">
                      ${p.amount}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-emerald-400 font-mono">
                      ${p.amountPaid}
                    </td>

                    <td className="py-3.5 px-3 font-bold font-mono">
                      <span className={p.remaining > 0 ? "text-amber-400" : "text-[#897B70]"}>
                        ${p.remaining}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-[#897B70] font-mono">
                      {p.paymentDate}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#1D1510] text-[#BDB0A4] text-xs font-medium border border-white/[0.08]">
                        {p.method}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeletePayment(p.id, p.invoiceRef)}
                        className="p-1 rounded-lg text-[#897B70] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Invoice Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-[#15100D] border border-white/[0.12] text-[#F8F5F1] rounded-2xl shadow-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-[#F8F5F1] flex items-center gap-2 text-base font-bold">
                <Receipt className="h-5 w-5 text-[#FF6B00]" /> Issue Student Fee Invoice
              </DialogTitle>
              <DialogDescription className="text-xs text-[#897B70]">
                Record advisory retainers, application processing fees, or visa filing charges.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3.5 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="pStudent" className="text-xs font-semibold text-[#BDB0A4]">Student Name *</Label>
                <Input
                  id="pStudent"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={newPay.studentName || ""}
                  onChange={(e) => setNewPay({ ...newPay, studentName: e.target.value })}
                  className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pService" className="text-xs font-semibold text-[#BDB0A4]">Service Description</Label>
                <Input
                  id="pService"
                  placeholder="e.g. UK Master's Comprehensive Admission Package"
                  value={newPay.service || ""}
                  onChange={(e) => setNewPay({ ...newPay, service: e.target.value })}
                  className="bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pAmount" className="text-xs font-semibold text-[#BDB0A4]">Total Amount ($) *</Label>
                  <Input
                    id="pAmount"
                    type="number"
                    required
                    placeholder="2500"
                    value={newPay.amount || ""}
                    onChange={(e) => setNewPay({ ...newPay, amount: Number(e.target.value) })}
                    className="font-mono bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pPaid" className="text-xs font-semibold text-[#BDB0A4]">Initial Payment ($)</Label>
                  <Input
                    id="pPaid"
                    type="number"
                    placeholder="1000"
                    value={newPay.amountPaid || ""}
                    onChange={(e) => setNewPay({ ...newPay, amountPaid: Number(e.target.value) })}
                    className="font-mono bg-[#1D1510] border-white/[0.1] text-xs text-[#F8F5F1] rounded-xl h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pMethod" className="text-xs font-semibold text-[#BDB0A4]">Payment Method</Label>
                <select
                  id="pMethod"
                  className="w-full h-9 rounded-xl border border-white/[0.1] bg-[#1D1510] px-3 text-xs text-[#F8F5F1] outline-none cursor-pointer"
                  value={newPay.method || "Bank Transfer"}
                  onChange={(e) => setNewPay({ ...newPay, method: e.target.value as any })}
                >
                  <option value="Bank Transfer" className="bg-[#1D1510]">Bank Transfer</option>
                  <option value="Credit Card" className="bg-[#1D1510]">Credit Card</option>
                  <option value="UPI / QR Code" className="bg-[#1D1510]">UPI / QR Code</option>
                  <option value="Cheque / Cash" className="bg-[#1D1510]">Cheque / Cash</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-[#897B70] hover:text-[#F8F5F1] rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A35] text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Generate Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
