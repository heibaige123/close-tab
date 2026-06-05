import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className={actions ? 'mb-6 flex items-end justify-between gap-3' : 'mb-6'}>
      <div>
        <h1 className="text-[1.75rem] text-slate-900 page-title">{title}</h1>
        <p className="mt-1.5 text-label text-slate-600/90 text-sm">{subtitle}</p>
      </div>
      {actions}
    </header>
  );
}
