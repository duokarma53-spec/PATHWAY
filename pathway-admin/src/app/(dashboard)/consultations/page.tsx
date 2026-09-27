import { AppointmentsClientView } from "../appointments/appointments-client"

export const metadata = {
  title: "Consultations & Appointments | Pathway CRM",
  description: "Schedule student counselling sessions, parent meetings, and visa advisory appointments.",
}

export default function ConsultationsPage() {
  return <AppointmentsClientView />
}
