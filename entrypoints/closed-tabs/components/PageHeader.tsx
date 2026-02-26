import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className={actions ? 'mb-5 flex items-end justify-between gap-3' : 'mb-5'}>
      <div>
        <h1 className="font-semibold text-slate-900 text-2xl tracking-tight">{title}</h1>
        <p className="mt-1 text-slate-500 text-sm">{subtitle}</p>
      </div>
      {actions}
    </header>
  );
}
