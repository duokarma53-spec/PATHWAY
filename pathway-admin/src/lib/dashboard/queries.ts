export async function getDashboardData() {
  // Since you mentioned we can connect Supabase later, returning mock data 
  // so the dashboard loads instantly without hanging on database connections.

  return {
    kpis: {
      newLeads: 14,
      upcomingConsultations: 3,
      activeApplications: 28,
      offers: 5
    },
    recentLeads: [],
    upcomingConsultations: [
      { id: 1, name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 98765 43210", preferred_date: new Date().toISOString(), preferred_time: "10:00", status: "pending" },
      { id: 2, name: "Priya Patel", email: "priya.p@example.com", phone: "+91 98765 43211", preferred_date: new Date().toISOString(), preferred_time: "14:30", status: "confirmed" }
    ],
    recentActivity: [],
    priorities: {
      overdueTasks: [
        { id: 1, title: "Review Stanford essay for Aman", due_date: new Date(Date.now() - 86400000).toISOString(), status: "pending" },
        { id: 2, title: "Follow up with visa team", due_date: new Date(Date.now() - 172800000).toISOString(), status: "pending" }
      ]
    }
  }
}
