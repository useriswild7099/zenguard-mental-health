import { NavLink as RouterNavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart3 } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/new', icon: PlusCircle, label: 'New Entry' },
  { to: '/insights', icon: BarChart3, label: 'Insights' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(item => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
}
