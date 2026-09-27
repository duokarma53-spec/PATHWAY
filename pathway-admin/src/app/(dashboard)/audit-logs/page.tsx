import { AuditLogsClientView } from "./audit-logs-client"

export const metadata = {
  title: "Audit & Activity Logs | Pathway CRM",
  description: "Chronological operational activity stream and security compliance audit trail.",
}

export default function AuditLogsPage() {
  return <AuditLogsClientView />
}
