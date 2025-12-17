"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Menu,
  Package2,
  Shield,
  BarChart3,
  RotateCcw,
  Megaphone,
  FileText,
  ExternalLink,
  Database,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  Sun,
  Moon,
  Laptop,
  Palette,
  TrendingUp
} from "lucide-react"
import { useAdminSidebar } from "./AdminSidebarContext"
import { hasPermission, PermissionResource, PermissionAction } from "@/lib/permissions"

interface NavItem {
  name: string
  href?: string
  icon: any
  featureFlag?: string
  permission?: {
    resource: PermissionResource
    action: PermissionAction
  }
  children?: {
    name: string
    href: string
    featureFlag?: string
    permission?: {
      resource: PermissionResource
      action: PermissionAction
    }
  }[]
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    icon: BarChart3,
    featureFlag: "analytics_dashboard",
    permission: { resource: "ANALYTICS", action: "VIEW" },
    children: [
      { name: "Dashboard", href: "/admin/analytics", featureFlag: "analytics_dashboard", permission: { resource: "ANALYTICS", action: "VIEW" } },
      { name: "Traffic & Attribution", href: "/admin/analytics/traffic", featureFlag: "traffic_analytics", permission: { resource: "ANALYTICS", action: "VIEW" } },
    ],
  },
  {
    name: "Catalog",
    icon: Package,
    permission: { resource: "PRODUCT", action: "VIEW" },
    children: [
      { name: "Products", href: "/admin/products", permission: { resource: "PRODUCT", action: "VIEW" } },
      { name: "Categories", href: "/admin/categories", permission: { resource: "CATEGORY", action: "VIEW" } },
    ],
  },
  {
    name: "Sales",
    icon: ShoppingCart,
    permission: { resource: "ORDER", action: "VIEW" },
    children: [
      { name: "Refunds", href: "/admin/refunds", permission: { resource: "REFUND", action: "VIEW" } },
      { name: "Orders", href: "/admin/orders", permission: { resource: "ORDER", action: "VIEW" } },
      { name: "Discounts", href: "/admin/discounts", permission: { resource: "DISCOUNT", action: "VIEW" } },
    ],
  },
  {
    name: "Invoices",
    href: "/admin/invoices",
    icon: FileText,
    featureFlag: "invoice_generator",
    permission: { resource: "INVOICE", action: "VIEW" },
  },
  {
    name: "POS",
    icon: ShoppingCart,
    featureFlag: "pos_system",
    permission: { resource: "POS", action: "VIEW" },
    children: [
      { name: "POS Terminal", href: "/admin/pos", permission: { resource: "POS", action: "VIEW" } },
      { name: "Orders", href: "/admin/pos/orders", permission: { resource: "POS", action: "VIEW" } },
      { name: "Reports", href: "/admin/pos/reports", permission: { resource: "POS", action: "VIEW" } },
      { name: "Settings", href: "/admin/pos/settings", permission: { resource: "POS", action: "UPDATE" } },
      { name: "Locations", href: "/admin/pos/locations", permission: { resource: "POS", action: "VIEW" } },
      { name: "Cashiers", href: "/admin/pos/cashiers", permission: { resource: "POS", action: "VIEW" } },
    ],
  },
  {
    name: "Customers",
    icon: Users,
    permission: { resource: "CUSTOMER", action: "VIEW" },
    children: [
      { name: "All Customers", href: "/admin/customers", permission: { resource: "CUSTOMER", action: "VIEW" } },
      { name: "Deletion Requests", href: "/admin/customers/deletion-requests", permission: { resource: "CUSTOMER", action: "VIEW" } },
    ],
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
    permission: { resource: "REVIEW", action: "VIEW" },
  },
  {
    name: "Inventory",
    icon: Package2,
    featureFlag: "inventory_management",
    permission: { resource: "INVENTORY", action: "VIEW" },
    children: [
      { name: "Dashboard", href: "/admin/inventory", permission: { resource: "INVENTORY", action: "VIEW" } },
      { name: "Stock History", href: "/admin/inventory/stock-history", permission: { resource: "INVENTORY", action: "VIEW" } },
      { name: "Suppliers", href: "/admin/inventory/suppliers", permission: { resource: "SUPPLIER", action: "VIEW" } },
      { name: "Purchase Orders", href: "/admin/inventory/purchase-orders", permission: { resource: "PURCHASE_ORDER", action: "VIEW" } },
      { name: "Bulk Update", href: "/admin/inventory/bulk-update", permission: { resource: "INVENTORY", action: "UPDATE" } },
      { name: "Low Stock Alerts", href: "/admin/inventory/alerts", permission: { resource: "STOCK_ALERT", action: "VIEW" } },
    ],
  },

  {
    name: "Marketing",
    icon: Megaphone,
    children: [
      { name: "Abandoned Carts", href: "/admin/abandoned-carts" },
      { name: "Flash Sales", href: "/admin/marketing/flash-sales", permission: { resource: "FLASH_SALE", action: "VIEW" } },
      { name: "Loyalty Program", href: "/admin/loyalty/settings", permission: { resource: "LOYALTY", action: "VIEW" } },
      { name: "Popups", href: "/admin/popups", permission: { resource: "POPUP", action: "VIEW" } },
      { name: "Email Campaigns", href: "/admin/marketing/email-campaigns", permission: { resource: "EMAIL_CAMPAIGN", action: "VIEW" } },
      { name: "Newsletter", href: "/admin/newsletter", permission: { resource: "NEWSLETTER", action: "VIEW" } },
    ],
  },
  {
    name: "System",
    icon: Shield,
    children: [
      { name: "Features", href: "/admin/features", permission: { resource: "FEATURES", action: "MANAGE" } },
      { name: "Permissions", href: "/admin/permissions", permission: { resource: "ADMIN_USER", action: "MANAGE" }, featureFlag: "multi_admin" },
      { name: "Admin Users", href: "/admin/users", permission: { resource: "ADMIN_USER", action: "VIEW" }, featureFlag: "multi_admin" },
    ],
  },
  {
    name: "Content",
    icon: FileText,
    featureFlag: "cms",
    permission: { resource: "CMS", action: "VIEW" },
    children: [
      { name: "Media Library", href: "/admin/media", permission: { resource: "MEDIA", action: "VIEW" } },
      { name: "Blog Posts", href: "/admin/cms/posts", permission: { resource: "BLOG", action: "VIEW" } },
      { name: "Pages", href: "/admin/cms/pages", permission: { resource: "PAGE", action: "VIEW" } },
      { name: "Block Templates", href: "/admin/cms/templates", permission: { resource: "TEMPLATE", action: "VIEW" } },
      { name: "Categories & Tags", href: "/admin/cms/categories", permission: { resource: "CMS", action: "VIEW" } },
    ],
  },
  {
    name: "Templates",
    href: "/admin/templates",
    icon: FileText,
    featureFlag: "template_manager",
    permission: { resource: "TEMPLATE", action: "VIEW" },
  },
  {
    name: "Themes",
    href: "/admin/themes",
    icon: Palette,
    featureFlag: "storefront_themes",
    permission: { resource: "THEME", action: "VIEW" },
  },
  {
    name: "Backup & Export",
    icon: Database,
    featureFlag: "backup_export",
    permission: { resource: "BACKUP", action: "VIEW" },
    children: [
      { name: "Backups", href: "/admin/backup", permission: { resource: "BACKUP", action: "VIEW" } },
      { name: "Data Export", href: "/admin/export", permission: { resource: "EXPORT", action: "VIEW" } },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: { resource: "SETTINGS", action: "VIEW" },
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { setTheme } = useTheme()
  const { isCollapsed, setIsCollapsed } = useAdminSidebar()
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([])

  // Initialize open menus based on current path
  useEffect(() => {
    const newOpenMenus: string[] = []
    navigation.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) =>
            pathname === child.href || pathname?.startsWith(child.href + "/")
        )
        if (isChildActive) {
          newOpenMenus.push(item.name)
        }
      }
    })
    setOpenMenus(newOpenMenus)
  }, [pathname])

  // Fetch enabled features
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/api/features/enabled');
        if (response.ok) {
          const data = await response.json();
          setEnabledFeatures(data.features || []);
        }
      } catch (error) {
        console.error('Error fetching features:', error);
      }
    };

    if (session) {
      fetchFeatures();
    }
  }, [session]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const isActive = (href?: string, children?: { href: string }[]) => {
    if (href) {
      return pathname === href || pathname?.startsWith(href + "/")
    }
    if (children) {
      return children.some(
        (child) => pathname === child.href || pathname?.startsWith(child.href + "/")
      )
    }
    return false
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold cursor-pointer">
          <Package2 className="h-6 w-6" />
          {!isCollapsed && <span className="">Admin</span>}
        </Link>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => window.open('/', '_blank')}
              title="Open Storefront"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

          </div>
        )}
      </div>
      <ScrollArea className="flex-1 min-h-0 px-3">
        <nav className="grid items-start gap-2 text-sm font-medium py-4">
          {navigation.filter(item => {
            // Dashboard is always visible to all admin roles
            if (item.name === 'Dashboard') return true;

            // Check permissions
            if (item.permission) {
              const userRole = (session?.user?.role as string) || '';
              if (!hasPermission(userRole, item.permission.resource, item.permission.action)) {
                return false;
              }
            }

            // PRO features - check feature flags
            if (item.featureFlag && !enabledFeatures.includes(item.featureFlag)) return false;

            return true;
          }).map((item) => {
            // Filter children based on feature flags and permissions
            let filteredItem = { ...item };
            if (item.children) {
              filteredItem.children = item.children.filter(child => {
                // Check permissions first
                if (child.permission) {
                  const userRole = (session?.user?.role as string) || '';
                  if (!hasPermission(userRole, child.permission.resource, child.permission.action)) {
                    return false;
                  }
                }

                // Then check feature flags
                if (child.featureFlag && !enabledFeatures.includes(child.featureFlag)) return false;
                if (child.name === 'Refunds' && !enabledFeatures.includes('refund_management')) return false;
                if (child.name === 'Abandoned Carts' && !enabledFeatures.includes('abandoned_cart')) return false;
                if (child.name === 'Flash Sales' && !enabledFeatures.includes('flash_sales')) return false;
                if (child.name === 'Loyalty Program' && !enabledFeatures.includes('loyalty_program')) return false;
                if (child.name === 'Popups' && !enabledFeatures.includes('exit_intent_popups')) return false;
                if (child.name === 'Email Campaigns' && !enabledFeatures.includes('email_campaigns')) return false;
                return true;
              });
              // Hide parent if no children remain
              if (filteredItem.children.length === 0) return null;
            }
            return filteredItem;
          }).filter(Boolean).map((item: any) => {
            const Icon = item.icon
            const active = isActive(item.href, item.children)
            const isOpen = openMenus.includes(item.name)

            if (item.children) {
              return (
                <Collapsible
                  key={item.name}
                  open={isOpen && !isCollapsed}
                  onOpenChange={() => !isCollapsed && toggleMenu(item.name)}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-between cursor-pointer",
                        isCollapsed && "justify-center px-2"
                      )}
                      title={isCollapsed ? item.name : ""}
                    >
                      <div className={cn(
                        "flex items-center",
                        isCollapsed ? "justify-center" : "gap-3"
                      )}>
                        <Icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isOpen && "rotate-90"
                          )}
                        />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-6 mt-1">
                    {item.children.map((child: any) => {
                      const childActive =
                        pathname === child.href ||
                        pathname?.startsWith(child.href + "/")
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                            childActive
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {child.name}
                        </Link>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href!}
                title={isCollapsed ? item.name : ""}
              >
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full cursor-pointer",
                    isCollapsed ? "justify-center px-2" : "justify-start"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4",
                    !isCollapsed && "mr-2"
                  )} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4 shrink-0">


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full justify-start px-2 cursor-pointer",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="rounded-lg">
                  {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold">{session?.user?.name}</span>
                  <span className="truncate text-xs">{session?.user?.email}</span>
                </div>
              )}
              {!isCollapsed && <ChevronsUpDown className="ml-auto size-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                  <AvatarFallback className="rounded-lg">
                    {session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session?.user?.name}</span>
                  <span className="truncate text-xs">{session?.user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                <Laptop className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/admin/login" })} className="cursor-pointer text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden fixed top-4 left-4 z-40 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden border-r bg-background lg:block transition-all duration-300 fixed top-0 left-0 h-screen group z-30",
          isCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border bg-background p-0 shadow-md hover:bg-accent hidden lg:flex items-center justify-center cursor-pointer",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          )}
          variant="outline"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft className={cn("h-3 w-3 transition-transform duration-200", isCollapsed && "rotate-180")} />
        </Button>
        <SidebarContent />
      </aside>
    </>
  )
}
