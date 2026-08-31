export default function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
      {label}
    </span>
  );
}
