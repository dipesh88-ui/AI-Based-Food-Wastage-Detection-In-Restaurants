'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, Settings, BarChart2, Info, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '../icons/logo';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/tips', label: 'Waste Reduction Tips', icon: Lightbulb },
];

const mobileOnlyItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/how-it-works', label: 'How It Works', icon: Info },
];

export default function DashboardNav({ isMobile = false }) {
  const pathname = usePathname();

  const allItems = isMobile ? [...mobileOnlyItems, ...navItems] : navItems;

  return (
    <nav className={cn('grid items-start px-2 text-sm font-medium lg:px-4', isMobile && 'mt-8 gap-2')}>
      {isMobile && 
        <Link href="/" className="flex items-center gap-2 font-semibold mb-8 px-2">
            <Logo className="h-10 w-auto" />
        </Link>
      }
      {allItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            {
              'bg-muted text-primary': pathname === item.href,
            }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
