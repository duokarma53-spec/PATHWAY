import { ContentClientView } from "../content/content-client"

export const metadata = {
  title: "Website Testimonials | Pathway CRM",
  description: "Publish and manage student success stories and testimonials.",
}

export default function TestimonialsPage() {
  return <ContentClientView defaultTab="Testimonial" />
}
