import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';
import { AdminMainContent } from '@/components/admin/AdminMainContent';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from '@/components/SessionProvider';
import { StoreProvider } from '@/lib/redux/StoreProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  return (
    <SessionProvider>
      <StoreProvider>
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
      </StoreProvider>
    </SessionProvider>
  );
}
