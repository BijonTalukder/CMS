'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUserStore from '@/store/userStore';

const navItems = [
  { key: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
  { key: 'tourist-spot', icon: <FileText size={20} />, label: 'Tourist Spot', href: '/dashboard/tourist-spot' },
  { key: 'news', icon: <FileText size={20} />, label: 'News', href: '/dashboard/news' },
  { key: 'breaking-news', icon: <FileText size={20} />, label: 'Breaking News', href: '/dashboard/breaking-news' },
  {
    key: 'users',
    icon: <Users size={20} />,
    label: 'Users',
    children: [
      { key: 'users-create', label: 'Create User', href: '/dashboard/users/create' },
      { key: 'users-list', label: 'List Users', href: '/dashboard/users/list' },
    ],
  },
{
    key: 'prompts',
    icon: <Users size={20} />,
    label: 'Prompts',
    children: [
      { key: 'prompts-create', label: 'Create Prompts', href: '/dashboard/prompts/create' },
      { key: 'prompts', label: 'List Users', href: '/dashboard/prompts' },
    ],
  },
  { key: 'settings', icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
];

type OpenState = Record<string, boolean>;

const Sidebar = ({ className = '' }) => {
  const pathname = usePathname();
  const user = useUserStore(state => state.user)

  const [open, setOpen] = React.useState<OpenState>(() => {
    const initial: OpenState = {};
    navItems.forEach((item) => {
      if (item.children && item.children.some((c) => pathname.startsWith(c.href))) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const isActive = (href?: string) => href && pathname.startsWith(href);

  const allowedKeys = React.useMemo(() => {
    if (!user?.userPermissions) return [];
    const keys: string[] = [];

    user.userPermissions.forEach((perm:any) => {
      Object.keys(perm.permissions).forEach((pKey) => {
        if (perm.permissions[pKey].includes('view')) {
          keys.push(pKey);
        }
      });
    });

    return [...new Set(keys)]; 
  }, [user]);

  const filteredNavItems = navItems.filter((item) => {
    if (!item.key) return false;
    if (item.key === 'dashboard' || item.key === 'settings') return true; 

    if (item.children) {
      const allowedChildren = item.children.filter((child) =>
        allowedKeys.some((key) => child.key?.includes(key))
      );
      if (allowedChildren.length) {
        item.children = allowedChildren;
        return true;
      }
      return false;
    }

    return allowedKeys.includes(item.key);
  });

  return (
    <div className={`pb-12 min-h-screen ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">CMS Dashboard</h2>
          <div className="space-y-1">
            {filteredNavItems.map((item, index) => {
              const hasChildren = !!item.children?.length;

              if (!hasChildren) {
                return (
                  <Link href={item.href!} key={index}>
                    <Button
                      variant={isActive(item.href) ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              }

              const opened = open[item.label];

              return (
                <div key={index} className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => toggle(item.label)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${
                        opened ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-[max-height] duration-200 ${
                      opened ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="mt-1 ml-6 space-y-1">
                      {item.children!.map((child, childIndex) => (
                        <Link href={child.href} key={childIndex}>
                          <Button
                            variant={isActive(child.href) ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-sm pl-6"
                          >
                            {child.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
