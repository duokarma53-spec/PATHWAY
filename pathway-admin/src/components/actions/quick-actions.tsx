import { MockActionDialog } from "./mock-action-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"

export function AddLeadButton({ className, variant }: { className?: string, variant?: any }) {
  return (
    <MockActionDialog
      title="Add New Lead"
      description="Enter the details for the new prospective student."
      actionLabel="Create Lead"
      trigger={
        <Button size="sm" variant={variant} className={className}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      }
      fields={[
        { name: "firstName", label: "First Name" },
        { name: "lastName", label: "Last Name" },
        { name: "email", label: "Email Address", type: "email" },
        { name: "inquiryType", label: "Inquiry Type", type: "select", options: [
          { label: "General", value: "general" },
          { label: "University Application", value: "application" },
          { label: "Visa Assistance", value: "visa" }
        ]}
      ]}
    />
  )
}

export function ScheduleButton({ className, variant = "outline" }: { className?: string, variant?: any }) {
  return (
    <MockActionDialog
      title="Schedule Consultation"
      description="Book a new consultation session."
      actionLabel="Schedule"
      trigger={
        <Button size="sm" variant={variant} className={className}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      }
      fields={[
        { name: "applicantName", label: "Applicant Name" },
        { name: "date", label: "Preferred Date", type: "date" },
        { name: "time", label: "Preferred Time", type: "time" }
      ]}
    />
  )
}

export function GenericAddButton({ 
  title, 
  entityName, 
  className,
  variant
}: { 
  title: string, 
  entityName: string,
  className?: string,
  variant?: any
}) {
  return (
    <MockActionDialog
      title={title}
      description={`Add a new ${entityName.toLowerCase()} to the system.`}
      actionLabel="Save"
      trigger={
        <Button size="sm" variant={variant} className={className}>
          <Plus className="mr-2 h-4 w-4" />
          Add {entityName}
        </Button>
      }
      fields={[
        { name: "name", label: `${entityName} Name` },
        { name: "status", label: "Status", type: "select", options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ]}
      ]}
    />
  )
}

export function QuickAddButton({ className }: { className?: string }) {
  return (
    <MockActionDialog
      title="Quick Add"
      description="Select the type of record you want to create."
      actionLabel="Continue"
      trigger={
        <Button size="sm" className={className}>
          <Plus className="h-4 w-4 mr-1.5" />
          <span className="font-medium">Add</span>
        </Button>
      }
      fields={[
        { name: "recordType", label: "Record Type", type: "select", options: [
          { label: "New Lead", value: "lead" },
          { label: "New Consultation", value: "consultation" },
          { label: "New Application", value: "application" }
        ]}
      ]}
    />
  )
}
