import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
  trend?: { value: number; label: string };
  onClick?: () => void;
}

export function KPICard({ title, value, icon: Icon, iconColor, iconBg, subtitle, trend, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col gap-4 transition-all duration-200 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</span>
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
          {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span
            className="font-medium"
            style={{ color: trend.value >= 0 ? '#00A09D' : '#F2726F' }}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
