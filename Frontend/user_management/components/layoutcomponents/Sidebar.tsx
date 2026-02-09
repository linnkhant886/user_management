'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Trello,
  FileText,
  Users,
  Briefcase,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  {
    label: 'User Management',
    icon: Package,
    children: [
      { label: 'Create User', path: '/dashboard/user-management/create-user' },
      { label: 'Create Role', path: '/dashboard/user-management/create-role' },
      { label: 'Roles List', path: '/dashboard/user-management/roles-list' },
    ],
  },
  { label: 'Kanban', icon: Trello, path: '/dashboard/kanban' },
  { label: 'Documents', icon: FileText, path: '/dashboard/documents' },
  { label: 'Team', icon: Users, path: '/dashboard/team' },
  { label: 'Projects', icon: Briefcase, path: '/dashboard/projects' },
  { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Products']);
  const pathname = usePathname();

  const toggleMenu = (label: string) => {
    if (collapsed) return;
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (path?: string) => path && pathname === path;
  const isChildActive = (children?: { label: string; path: string }[]) =>
    children?.some((child) => pathname === child.path);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/60 from-background to-background/95 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-16 items-center border-b border-border/40 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl    from-indigo-500 to-purple-600 text-white shadow-md">
          <span className="font-bold tracking-tight">D</span>
        </div>
        {!collapsed && (
          <span className="ml-3 text-lg font-semibold tracking-tight text-foreground">
            Dashboard
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.path) || isChildActive(item.children);
            const isExpanded = expandedMenus.includes(item.label);

            if (item.children) {
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isItemActive
                        ? 'bg-accent/80 text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                      collapsed && 'justify-center'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 transition-transform" />
                        ) : (
                          <ChevronRight className="h-4 w-4 transition-transform" />
                        )}
                      </>
                    )}

                    {/* Active indicator bar */}
                    {isItemActive && !collapsed && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                  </button>

                  {!collapsed && isExpanded && (
                    <ul className="mt-1 space-y-1 pl-11">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            href={child.path}
                            className={cn(
                              'relative block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                              isActive(child.path)
                                ? 'text-primary font-semibold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                            )}
                          >
                            {child.label}
                            {isActive(child.path) && (
                              <span className="absolute -left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.path!}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isItemActive
                      ? 'bg-accent/80 text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                    collapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                  {!collapsed && <span>{item.label}</span>}

                  {/* Active indicator */}
                  {isItemActive && (
                    <>
                      {!collapsed && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      {collapsed && (
                        <span className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-border/40 p-4">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
