"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
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
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  AlertTriangle,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Package2,
  Shield,
  BarChart3,
  RotateCcw,
  Megaphone,
  FileText,
  ExternalLink,
} from "lucide-react"

interface NavItem {
  name: string
  href?: string
  icon: any
  featureFlag?: string
  children?: {
    name: string
    href: string
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
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Catalog",
    icon: Package,
    children: [
      { name: "Products", href: "/admin/products" },
      { name: "Categories", href: "/admin/categories" },
    ],
  },
  {
    name: "Sales",
    icon: ShoppingCart,
    children: [
      { name: "Refunds", href: "/admin/refunds" },
      { name: "Orders", href: "/admin/orders" },
      { name: "Discounts", href: "/admin/discounts" },
    ],
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Alerts",
    icon: AlertTriangle,
    children: [
      { name: "Stock Alerts", href: "/admin/stock-alerts" },
      { name: "Newsletter", href: "/admin/newsletter" },
    ],
  },
  {
    name: "Marketing",
    icon: Megaphone,
    children: [
      { name: "Abandoned Carts", href: "/admin/abandoned-carts" },
      { name: "Email Campaigns", href: "/admin/marketing/email-campaigns" },
    ],
  },
  {
    name: "Features",
    href: "/admin/features",
    icon: Shield,
  },
  {
    name: "Content",
    icon: FileText,
    featureFlag: "cms",
    children: [
      { name: "Media Library", href: "/admin/media" },
      { name: "Blog Posts", href: "/admin/cms/posts" },
      { name: "Pages", href: "/admin/cms/pages" },
      { name: "Categories & Tags", href: "/admin/cms/categories" },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
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
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          {!isCollapsed && <span className="">Admin</span>}
        </Link>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open('/', '_blank')}
              title="Open Storefront"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(true)}
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="grid items-start gap-2 text-sm font-medium py-4">
          {navigation.filter(item => {
            if (item.name === 'Features' && (session?.user?.role as string) !== 'SUPERADMIN') return false;
            if (item.name === 'Analytics' && !enabledFeatures.includes('analytics_dashboard')) return false;
            if (item.name === 'Marketing' && !enabledFeatures.includes('email_campaigns')) return false;
            return true;
          }).map((item) => {
            // Filter children based on feature flags
            let filteredItem = { ...item };
            if (item.children) {
              filteredItem.children = item.children.filter(child => {
                if (child.name === 'Refunds' && !enabledFeatures.includes('refund_management')) return false;
                if (child.name === 'Templates' && !enabledFeatures.includes('template_manager')) return false;
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
                        "w-full justify-between",
                        isCollapsed && "justify-center px-2"
                      )}
                      title={isCollapsed ? item.name : ""}
                    >
                      <div className="flex items-center gap-3">
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
                            "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
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
                    "w-full justify-start",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex w-full justify-start gap-2 px-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50",
            isCollapsed && "justify-center px-2"
          )}
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
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
            className="shrink-0 lg:hidden fixed top-4 left-4 z-40"
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
          "hidden border-r bg-background lg:block transition-all duration-300 sticky top-0 h-screen overflow-y-auto no-scrollbar",
          isCollapsed ? "w-[70px]" : "w-[240px]" // Adjusted widths
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
