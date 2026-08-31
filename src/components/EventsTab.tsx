import { useState } from 'react';
import { MapPin, Heart, CalendarPlus, Loader2, AlertCircle, CalendarDays } from 'lucide-react';
import type { EventItem } from '@/data';
import { supabase } from '@/lib/supabase';
import { FALLBACK_EVENTS } from '@/data';

// Safari/iOS-biztos dátumformázó segédfüggvény
function safeFormatDateParts(dateStr?: string): { month: string; day: string } {
  const months = ['JAN', 'FEB', 'MÁRC', 'ÁPR', 'MÁJ', 'JÚN', 'JÚL', 'AUG', 'SZEPT', 'OKT', 'NOV', 'DEC'];
  if (!dateStr) return { month: 'INFO', day: '' };

  // Számok kinyerése (pl. 2026. 08. 31. vagy 2026-08-31)
  const numbers = dateStr.match(/\d+/g);
  if (numbers && numbers.length >= 3) {
    const monthIndex = parseInt(numbers[1], 10) - 1;
    const day = parseInt(numbers[2], 10).toString();
    const month = months[monthIndex] || 'INFO';
    return { month, day: isNaN(parseInt(day, 10)) ? '' : day };
  }

  const cleaned = dateStr.replace(/\./g, '-').trim();
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) {
    return {
      month: months[parsed.getMonth()] || 'INFO',
      day: parsed.getDate().toString(),
    };
  }

  return { month: 'INFO', day: '' };
}

export default function EventsTab({
  events,
  loading,
  error,
  onRetry,
  onInterested,
}: {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onInterested: (id: string, count: number) => void;
}) {
  const [pending, setPending] = useState<string | null>(null);
  const [localInterest, setLocalInterest] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 size={28} className="animate-spin mb-3" />
        <p className="text-sm">Események betöltése…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <AlertCircle size={28} className="text-rose-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">Nem sikerült betölteni az eseményeket.</p>
        <p className="text-xs text-gray-400 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow-soft active:scale-95"
        >
          Újrapróbálás
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <CalendarDays size={28} className="mb-3" />
        <p className="text-sm">Még nincsenek események.</p>
      </div>
    );
  }

  const toggle = async (ev: EventItem) => {
    if (pending) return;
    const wasOn = !!localInterest[ev.id];
    const next = wasOn ? (ev.interested || 0) : (ev.interested || 0) + 1;
    setLocalInterest((s) => ({ ...s, [ev.id]: !wasOn }));

    if (!supabase || FALLBACK_EVENTS.some((e) => e.id === ev.id)) {
      onInterested(ev.id, next);
      return;
    }

    setPending(ev.id);
    const { error } = await supabase
      .from('events')
      .update({ interested: next, interested_count: next, interestedCount: next })
      .eq('id', ev.id);
    setPending(null);
    if (error) {
      setLocalInterest((s) => ({ ...s, [ev.id]: wasOn }));
    } else {
      onInterested(ev.id, next);
    }
  };

  const addToCalendar = (ev: EventItem) => {
    let d = new Date();
    const numbers = ev.date?.match(/\d+/g);
    const timeNumbers = ev.time?.match(/\d+/g);

    if (numbers && numbers.length >= 3) {
      const year = parseInt(numbers[0], 10);
      const month = parseInt(numbers[1], 10) - 1;
      const day = parseInt(numbers[2], 10);
      const hours = timeNumbers && timeNumbers.length >= 1 ? parseInt(timeNumbers[0], 10) : 20;
      const minutes = timeNumbers && timeNumbers.length >= 2 ? parseInt(timeNumbers[1], 10) : 0;
      d = new Date(year, month, day, hours, minutes);
    }

    const end = new Date(d.getTime() + 60 * 60 * 1000);
    const fmt = (x: Date) => x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HOK//App//HU',
      'BEGIN:VEVENT',
      `UID:${ev.id}@hok.app`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(d)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${ev.title}`,
      `LOCATION:${ev.location || 'JUGYU'}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-3">
      {events.map((ev, i) => {
        const { month, day } = safeFormatDateParts(ev.date);
        const isOn = !!localInterest[ev.id];
        const isPending = pending === ev.id;
        const interestCount = (ev.interested || 0) + (isOn ? 1 : 0);

        return (
          <article
            key={ev.id}
            className="glass rounded-2xl p-4 shadow-soft animate-fade-up flex gap-4"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {/* Date box */}
            <div className="shrink-0 w-16 rounded-2xl bg-gradient-to-b from-primary-500 to-primary-700 text-white flex flex-col items-center justify-center py-3 shadow-soft">
              <span className="text-[11px] font-semibold tracking-wide opacity-90">{month}</span>
              <span className="text-2xl font-bold leading-none mt-0.5">{day}</span>
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 leading-snug">{ev.title}</h3>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                <span className="font-medium text-primary-600">{ev.time}</span>
              </div>
              <div className="flex items-start gap-1 mt-0.5 text-sm text-gray-500">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                <span className="line-clamp-1">{ev.location}</span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => toggle(ev)}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-90 disabled:opacity-50 ${
                    isOn
                      ? 'bg-rose-500 text-white shadow-soft'
                      : 'bg-white/60 text-gray-600 border border-gray-200'
                  }`}
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Heart size={14} fill={isOn ? 'currentColor' : 'none'} />
                  )}
                  Érdekel · {interestCount}
                </button>
                <button
                  onClick={() => addToCalendar(ev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 transition-all active:scale-90"
                >
                  <CalendarPlus size={14} />
                  Naptár
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
