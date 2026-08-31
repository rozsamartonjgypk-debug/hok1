import { useState } from 'react';
import { Lock, LogIn, LogOut, Plus, Newspaper, CalendarDays, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import type { NewsItem, EventItem } from '@/data';
import { CATEGORIES } from '@/data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Props = {
  onAddNews: (n: NewsItem) => void;
  onAddEvent: (e: EventItem) => void;
};

const ADMIN_PASSWORD = 'admin123';

export default function AdminTab({ onAddNews, onAddEvent }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
      setPw('');
    } else {
      setError('Hibás jelszó. Próbáld újra.');
    }
  };

  if (!authed) {
    return (
      <div className="px-4 pt-10 pb-28">
        <div className="glass rounded-3xl p-7 shadow-card max-w-md mx-auto animate-scale-in">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-3">
              <Lock size={26} />
            </span>
            <h2 className="text-xl font-bold text-gray-900">Admin belépés</h2>
            <p className="text-sm text-gray-500 mt-1">A HÖK szerkesztői felület védett.</p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1.5">Jelszó</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
          />
          {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}

          <button
            onClick={login}
            className="w-full mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white font-semibold py-3 shadow-soft transition-all active:scale-95 hover:bg-primary-700"
          >
            <LogIn size={18} />
            Belépés
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-4">
            Prototípus – a jelszó: <span className="font-mono font-semibold">admin123</span>
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard onAddNews={onAddNews} onAddEvent={onAddEvent} onLogout={() => setAuthed(false)} />;
}

function Dashboard({
  onAddNews,
  onAddEvent,
  onLogout,
}: {
  onAddNews: (n: NewsItem) => void;
  onAddEvent: (e: EventItem) => void;
  onLogout: () => void;
}) {
  const [mode, setMode] = useState<'news' | 'event'>('news');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // shared fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  // event-only
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const reset = () => {
    setTitle('');
    setDate('');
    setDesc('');
    setImage('');
    setTime('');
    setLocation('');
  };

  const submit = async () => {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      if (!isSupabaseConfigured || !supabase) {
        if (mode === 'news') {
          onAddNews({
            id: 'n' + Date.now(),
            title: title.trim(),
            category,
            excerpt: desc.trim() || '—',
            date: (date || new Date().toISOString().slice(0, 10)).replace(/-/g, '.'),
            image: image.trim() || 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
            featured: false,
          });
        } else {
          onAddEvent({
            id: 'e' + Date.now(),
            title: title.trim(),
            date: date || new Date().toISOString().slice(0, 10),
            time: time || '12:00',
            location: location.trim() || 'Egyetem',
            interested: 0,
          });
        }
        reset();
        setDone(true);
        setTimeout(() => setDone(false), 2200);
        return;
      }

      if (mode === 'news') {
        const isoDate = date || new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
          .from('news')
          .insert({
            title: title.trim(),
            category,
            excerpt: desc.trim() || '—',
            date: isoDate,
            image: image.trim() || 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
            featured: false,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          onAddNews({
            id: data.id,
            title: data.title,
            category: data.category,
            excerpt: data.excerpt,
            date: data.date,
            image: data.image,
            featured: data.featured,
          });
        }
      } else {
        const isoDate = date || new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
          .from('events')
          .insert({
            title: title.trim(),
            date: isoDate,
            time: time || '12:00',
            location: location.trim() || 'Egyetem',
            interested: 0,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          onAddEvent({
            id: data.id,
            title: data.title,
            date: data.date,
            time: data.time,
            location: data.location,
            interested: data.interested,
          });
        }
      }
      reset();
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ismeretlen hiba történt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Vezérlőpult</h2>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-rose-500 transition"
        >
          <LogOut size={16} />
          Kilépés
        </button>
      </div>

      {/* Toggle */}
      <div className="glass rounded-2xl p-1.5 flex shadow-soft">
        <button
          onClick={() => setMode('news')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            mode === 'news' ? 'bg-primary-600 text-white shadow-soft' : 'text-gray-500'
          }`}
        >
          <Newspaper size={16} />
          Hír felvitele
        </button>
        <button
          onClick={() => setMode('event')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            mode === 'event' ? 'bg-primary-600 text-white shadow-soft' : 'text-gray-500'
          }`}
        >
          <CalendarDays size={16} />
          Esemény felvitele
        </button>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-5 shadow-soft space-y-4 animate-scale-in" key={mode}>
        <Field label="Cím">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={mode === 'news' ? 'Hír címe' : 'Esemény neve'}
            className="input"
          />
        </Field>

        {mode === 'news' ? (
          <Field label="Kategória">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Időpont">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Helyszín">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Helyszín"
                className="input"
              />
            </Field>
          </div>
        )}

        <Field label="Dátum">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </Field>

        <Field label={mode === 'news' ? 'Leírás' : 'Rövid leírás'}>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="Rövid tartalom…"
            className="input resize-none"
          />
        </Field>

        {mode === 'news' && (
          <Field label="Kép URL">
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://…"
              className="input"
            />
          </Field>
        )}

        {submitError && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3">
            <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
            <p className="text-xs text-rose-600">{submitError}</p>
          </div>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white font-semibold py-3 shadow-soft transition-all active:scale-95 hover:bg-primary-700 disabled:opacity-60"
        >
          {done ? (
            <CheckCircle2 size={18} />
          ) : submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          {done ? 'Sikeresen hozzáadva!' : submitting ? 'Beküldés…' : 'Beküldés'}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          background: rgba(255,255,255,0.8);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
