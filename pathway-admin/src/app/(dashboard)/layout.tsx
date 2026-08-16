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
      <div className="flex h-screen overflow-hidden bg-muted/20">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
