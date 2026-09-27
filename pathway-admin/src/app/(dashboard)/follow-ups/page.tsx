import { TasksClientView } from "../tasks/tasks-client"

export const metadata = {
  title: "Client Follow-ups | Pathway CRM",
  description: "Track phone calls, WhatsApp check-ins, and scheduled reminders.",
}

export default function FollowUpsPage() {
  return <TasksClientView defaultCategory="Call follow-up" />
}
