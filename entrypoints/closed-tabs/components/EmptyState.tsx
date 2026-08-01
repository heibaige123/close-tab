import { memo } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = memo(function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="empty-shell">
      <p className="font-medium text-ink-muted text-sm">{title}</p>
      <p className="mt-1.5 text-ink-faint text-xs">{description}</p>
    </section>
  );
});
