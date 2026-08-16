import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { SidebarProvider } from "@/contexts/sidebar-context"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background selection:bg-primary/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0 relative z-10">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-6 md:px-8 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
