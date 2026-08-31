import { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Wallet,
  ChevronDown,
  Monitor,
  Globe,
  FileText,
  Library,
  KeyRound,
  Utensils,
  ExternalLink,
} from 'lucide-react';
import type { FaqSection } from '@/data';
import { FAQ, QUICK_LINKS } from '@/data';

const ICONS: Record<string, typeof GraduationCap> = {
  GraduationCap,
  Building2,
  Wallet,
  Monitor,
  Globe,
  FileText,
  Library,
  KeyRound,
  Utensils,
};

function Accordion({ section }: { section: FaqSection }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[section.icon] ?? GraduationCap;

  return (
    <div className="glass rounded-2xl shadow-soft overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon size={20} />
        </span>
        <span className="flex-1 font-semibold text-gray-900">{section.title}</span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0 space-y-3">
            {section.items.map((it, idx) => (
              <div key={idx} className="border-t border-gray-200/60 pt-3">
                <p className="font-medium text-sm text-gray-800">{it.q}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{it.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InfoTab() {
  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Gyakori kérdések</h3>
        <div className="space-y-3">
          {FAQ.map((s, i) => (
            <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Accordion section={s} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Gyorslinkek</h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map((l, i) => {
            const Icon = ICONS[l.icon] ?? Globe;
            return (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-4 shadow-soft flex flex-col gap-2 animate-fade-up transition-all active:scale-95 hover:shadow-card"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={20} />
                  </span>
                  <ExternalLink size={15} className="text-gray-300" />
                </div>
                <span className="font-semibold text-sm text-gray-800">{l.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
