'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminSidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <AdminSidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>
            {children}
        </AdminSidebarContext.Provider>
    );
}

export function useAdminSidebar() {
    const context = useContext(AdminSidebarContext);
    if (context === undefined) {
        throw new Error('useAdminSidebar must be used within an AdminSidebarProvider');
    }
    return context;
}
