import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: '#F1EBEF' }}
      >
        <Icon size={28} style={{ color: '#714B67' }} />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
          style={{ backgroundColor: '#714B67' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5B3A53')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#714B67')}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
