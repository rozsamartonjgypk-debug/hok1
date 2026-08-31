import { useCallback, useEffect, useState } from 'react';
import BottomNav, { type TabId } from '@/components/BottomNav';
import Header from '@/components/Header';
import NewsTab from '@/components/NewsTab';
import EventsTab from '@/components/EventsTab';
import InfoTab from '@/components/InfoTab';
import AdminTab from '@/components/AdminTab';
import type { NewsItem, EventItem } from '@/data';
import { FALLBACK_NEWS, FALLBACK_EVENTS } from '@/data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const TITLES: Record<TabId, { title: string; subtitle?: string }> = {
  news: { title: 'Hírek', subtitle: 'A kari HÖK legfrissebb tudnivalói' },
  events: { title: 'Események', subtitle: 'Közelgő programok és események' },
  info: { title: 'Hasznos Infók', subtitle: 'GYIK és gyorslinkek' },
  admin: { title: 'Admin', subtitle: 'Szerkesztői felület' },
};

export default function App() {
  const [tab, setTab] = useState<TabId>('news');
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(null);

    if (!isSupabaseConfigured || !supabase) {
      setNews(FALLBACK_NEWS);
      setNewsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, category, excerpt, date, image, featured')
        .order('date', { ascending: false });

      if (error) {
        setNewsError(error.message);
        setNews(FALLBACK_NEWS);
        return;
      }
      if (!data || data.length === 0) {
        setNews(FALLBACK_NEWS);
        return;
      }
      setNews(
        data.map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          excerpt: n.excerpt,
          date: n.date,
          image: n.image,
          featured: n.featured,
        }))
      );
    } catch (err) {
      setNewsError(err instanceof Error ? err.message : 'Hálózati hiba');
      setNews(FALLBACK_NEWS);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);

    if (!isSupabaseConfigured || !supabase) {
      setEvents(FALLBACK_EVENTS);
      setEventsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, location, interested')
        .order('date', { ascending: true });

      if (error) {
        setEventsError(error.message);
        setEvents(FALLBACK_EVENTS);
        return;
      }
      if (!data || data.length === 0) {
        setEvents(FALLBACK_EVENTS);
        return;
      }
      setEvents(
        data.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          location: e.location,
          interested: e.interested,
        }))
      );
    } catch (err) {
      setEventsError(err instanceof Error ? err.message : 'Hálózati hiba');
      setEvents(FALLBACK_EVENTS);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, [fetchNews, fetchEvents]);

  const addNews = (n: NewsItem) => setNews((prev) => [n, ...prev]);
  const addEvent = (e: EventItem) => setEvents((prev) => [e, ...prev]);
  const updateInterested = (id: string, count: number) =>
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, interested: count } : e)));

  const meta = TITLES[tab];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={meta.title} subtitle={meta.subtitle} />
      <main className="max-w-md mx-auto">
        <div key={tab} className="animate-fade-up">
          {tab === 'news' && (
            <NewsTab news={news} loading={newsLoading} error={newsError} onRetry={fetchNews} />
          )}
          {tab === 'events' && (
            <EventsTab
              events={events}
              loading={eventsLoading}
              error={eventsError}
              onRetry={fetchEvents}
              onInterested={updateInterested}
            />
          )}
          {tab === 'info' && <InfoTab />}
          {tab === 'admin' && <AdminTab onAddNews={addNews} onAddEvent={addEvent} />}
        </div>
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
