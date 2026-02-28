import { memo } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = memo(function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="bg-white/70 shadow-sm backdrop-blur-[2px] backdrop-saturate-[1.2] px-6 py-10 border border-slate-200/80 rounded-2xl text-center">
      <p className="font-medium text-slate-700 text-sm">{title}</p>
      <p className="mt-1 text-slate-500 text-xs">{description}</p>
    </section>
  );
});
