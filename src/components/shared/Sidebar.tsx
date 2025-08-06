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

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <FileText size={20} />, label: 'Tourist Spot', href: '/dashboard/tourist-spot' },
  { icon: <FileText size={20} />, label: 'News', href: '/dashboard/news' },
  { icon: <FileText size={20} />,
   label: 'Breaking News',
   href: '/dashboard/breaking-news' },
  {
    icon: <Users size={20} />,
    label: 'Users',
    children: [
      { label: 'Create User', href: '/dashboard/users/create' },
      { label: 'List Users', href: '/dashboard/users/list' },
    ],
  },
  { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
];

type OpenState = Record<string, boolean>;

const Sidebar = ({ className = '' }) => {
  const pathname = usePathname();

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

  return (
    <div className={`pb-12 min-h-screen ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">CMS Dashboard</h2>
          <div className="space-y-1">
            {navItems.map((item, index) => {
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
