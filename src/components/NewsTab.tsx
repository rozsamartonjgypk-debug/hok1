import { Newspaper, CalendarDays, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import type { NewsItem } from '@/data';
import CategoryPill from '@/components/CategoryPill';

export default function NewsTab({
  news,
  loading,
  error,
  onRetry,
}: {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 size={28} className="animate-spin mb-3" />
        <p className="text-sm">Hírek betöltése…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <AlertCircle size={28} className="text-rose-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">Nem sikerült betölteni a híreket.</p>
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

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Newspaper size={28} className="mb-3" />
        <p className="text-sm">Még nincsenek hírek.</p>
      </div>
    );
  }

  const featured = news.length > 0 ? (news.find((n) => n.featured) ?? news[0]) : null;
  const rest = featured ? news.filter((n) => n.id !== featured.id) : [];

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      {/* Featured */}
      {featured && (
        <article className="relative overflow-hidden rounded-3xl shadow-card animate-fade-up">
          <div className="relative h-56">
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CategoryPill label={featured.category} />
              <span className="text-[11px] text-white/80 font-medium">{featured.date}</span>
            </div>
            <h2 className="text-white text-xl font-bold leading-snug drop-shadow-sm">
              {featured.title}
            </h2>
          </div>
        </article>
      )}

      {/* Feed */}
      <div className="flex items-center gap-2 pt-1">
        <Newspaper size={18} className="text-primary-600" />
        <h3 className="text-base font-semibold text-gray-800">Legfrissebb hírek</h3>
      </div>

      <div className="space-y-3">
        {rest.map((n, i) => (
          <article
            key={n.id}
            className="glass rounded-2xl p-3 shadow-soft flex gap-3 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
              <img src={n.image} alt={n.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CategoryPill label={n.category} />
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                  <CalendarDays size={12} />
                  {n.date}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                {n.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.excerpt}</p>
            </div>
            <ChevronRight size={18} className="text-gray-300 self-center shrink-0" />
          </article>
        ))}
      </div>
    </div>
  );
}
