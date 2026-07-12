import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../AppContext';
import type { Page } from '../../types';

interface Crumb {
  label: string;
  page?: Page;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: Props) {
  const { navigate } = useApp();

  return (
    <div className="flex flex-col gap-1 mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-1">
          <button onClick={() => navigate('dashboard')} className="flex items-center gap-1 hover:text-gray-600 transition-colors">
            <Home size={12} />
            <span>Dashboard</span>
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight size={12} />
              {crumb.page ? (
                <button
                  onClick={() => navigate(crumb.page!)}
                  className="hover:text-gray-600 transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
