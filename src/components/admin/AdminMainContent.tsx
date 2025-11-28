'use client';

import { useAdminSidebar } from './AdminSidebarContext';
import { cn } from '@/lib/utils';

export function AdminMainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useAdminSidebar();

  return (
    <main
      className={cn(
        'min-h-screen transition-all duration-300 p-8 lg:p-10',
        // Add left margin on large screens to push content to the right of the fixed sidebar
        isCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[240px]',
        // Adjust width to account for sidebar
        isCollapsed ? 'lg:w-[calc(100%-70px)]' : 'lg:w-[calc(100%-240px)]'
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}

