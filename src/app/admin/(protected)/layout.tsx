import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';
import { AdminMainContent } from '@/components/admin/AdminMainContent';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from '@/components/SessionProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
    redirect('/admin/login');
  }

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AdminSidebarProvider>
          <div className="min-h-screen bg-background">
            <AdminSidebar />
            <AdminMainContent>
              {children}
            </AdminMainContent>
          </div>
        </AdminSidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
