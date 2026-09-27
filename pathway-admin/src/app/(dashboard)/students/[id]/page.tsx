import { StudentDetailClient } from "./student-detail-client"
import { INITIAL_STUDENTS } from "@/lib/mock-data"

export function generateStaticParams() {
  return INITIAL_STUDENTS.map(s => ({ id: s.id }))
}

export const metadata = {
  title: "Student Profile | Pathway CRM",
  description: "Comprehensive student records, university applications, documents, appointments and payments.",
}

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <StudentDetailClient studentId={resolvedParams.id} />
}
