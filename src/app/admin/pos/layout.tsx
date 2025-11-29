import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isFeatureEnabled } from '@/lib/check-feature';
import { StoreProvider } from '@/lib/redux/StoreProvider';
import { SessionProvider } from '@/components/SessionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export default async function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check authentication
  if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  // Check feature flag
  const featureEnabled = await isFeatureEnabled('pos_system');
  if (!featureEnabled) {
    redirect('/admin');
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
          {children}
        </ThemeProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

