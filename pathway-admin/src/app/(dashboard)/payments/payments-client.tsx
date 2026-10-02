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
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Payment & Fee Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              ${totalPaid.toLocaleString()} Collected
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Track student consultancy retainers, university application fees, and visa processing charges.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl border-border/70 hover:bg-muted/50 text-xs flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export Ledger
          </Button>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-primary-foreground font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> Record Payment / Invoice
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Revenue Invoiced</p>
          <p className="text-2xl font-bold text-foreground mt-1">${totalBilled.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" /> All active contracts
          </p>
        </Card>

        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Paid Amount</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">${totalPaid.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Cleared funds</p>
        </Card>

        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Pending Payments</p>
          <p className="text-2xl font-bold text-primary mt-1">${totalPending.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Balance to be settled</p>
        </Card>

        <Card className="border-border/60 bg-card/75 p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Overdue Invoices</p>
          <p className="text-2xl font-bold text-destructive mt-1">{overdueCount}</p>
          <p className="text-[11px] text-destructive/80 mt-1">Require immediate follow-up</p>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, service, or invoice reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/50 text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground font-medium outline-none"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Paid">Paid (Full)</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Ledger Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Service Description</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Paid Amount</th>
                <th className="py-3 px-3">Remaining Due</th>
                <th className="py-3 px-3">Method & Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                    {p.invoiceRef}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-foreground whitespace-nowrap">
                    {p.studentName}
                  </td>
                  <td className="py-3.5 px-3 min-w-[200px] text-muted-foreground">
                    {p.service}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-foreground whitespace-nowrap">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-400 whitespace-nowrap">
                    ${p.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={p.remaining > 0 ? "font-semibold text-amber-400" : "text-muted-foreground"}>
                      ${p.remaining.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-muted-foreground">
                    <span>{p.method}</span> • <span>{p.paymentDate}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDeletePayment(p.id, p.invoiceRef)}
                      className="p-1 rounded text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Payment Record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Record Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/70 rounded-2xl">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2 text-base">
                <Receipt className="h-5 w-5" /> Record Fee or Issue Invoice
              </DialogTitle>
              <DialogDescription>
                Track a student payment or invoice reference.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="payStudent" className="text-xs">Student Name *</Label>
                <Input
                  id="payStudent"
                  required
                  placeholder="e.g. Aarav Mehta"
                  onChange={(e) => setNewPay({ ...newPay, studentName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payService" className="text-xs">Service</Label>
                <Input
                  id="payService"
                  placeholder="e.g. UK Masters Advisory & CAS Filing"
                  onChange={(e) => setNewPay({ ...newPay, service: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="payAmt" className="text-xs">Total Fee ($) *</Label>
                  <Input
                    id="payAmt"
                    type="number"
                    required
                    placeholder="2000"
                    onChange={(e) => setNewPay({ ...newPay, amount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payPaid" className="text-xs">Amount Paid ($)</Label>
                  <Input
                    id="payPaid"
                    type="number"
                    placeholder="1000"
                    onChange={(e) => setNewPay({ ...newPay, amountPaid: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payMethod" className="text-xs">Payment Method</Label>
                <select
                  id="payMethod"
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs"
                  onChange={(e) => setNewPay({ ...newPay, method: e.target.value as any })}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI / Net Banking">UPI / Net Banking</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cheque / Cash">Cheque / Cash</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Save Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
