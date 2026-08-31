import { useState } from 'react';
import { Newspaper, CalendarDays, Info, ShieldCheck } from 'lucide-react';

export type TabId = 'news' | 'events' | 'info' | 'admin';

const TABS: { id: TabId; label: string; icon: typeof Newspaper }[] = [
  { id: 'news', label: 'Hírek', icon: Newspaper },
  { id: 'events', label: 'Események', icon: CalendarDays },
  { id: 'info', label: 'Hasznos Infók', icon: Info },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 safe-bottom">
      <div className="glass-nav mx-auto max-w-md rounded-3xl shadow-glass px-2 py-2 flex justify-between">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-300 active:scale-90"
            >
              <span
                className={`flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-primary-600 text-white shadow-soft scale-105' : 'text-gray-500'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span
                className={`text-[11px] font-medium transition-colors duration-300 ${
                  isActive ? 'text-primary-700' : 'text-gray-500'
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function useTab() {
  const [tab, setTab] = useState<TabId>('news');
  return { tab, setTab };
}
