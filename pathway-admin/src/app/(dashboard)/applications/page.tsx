import { ApplicationsClientView } from "./applications-client"

export const metadata = {
  title: "Applications Pipeline | Pathway CRM",
  description: "Track student applications, conditional/unconditional offers, deposits, and university deadlines.",
}

export default function ApplicationsPage() {
  return <ApplicationsClientView />
}
