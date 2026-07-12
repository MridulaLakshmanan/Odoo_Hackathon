import type { AssetStatus, BookingStatus, MaintenanceStatus, MaintenancePriority, AllocationStatus } from '../../types';

type StatusType = AssetStatus | BookingStatus | MaintenanceStatus | MaintenancePriority | AllocationStatus | string;

const styleMap: Record<string, { bg: string; text: string; dot: string }> = {
  // Asset status
  Available:    { bg: '#E8F8F8', text: '#00A09D', dot: '#00A09D' },
  Allocated:    { bg: '#F1EBEF', text: '#714B67', dot: '#714B67' },
  Maintenance:  { bg: '#FEF3E2', text: '#D97706', dot: '#F5A623' },
  Retired:      { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  // Allocation status
  Active:       { bg: '#E8F8F8', text: '#00A09D', dot: '#00A09D' },
  Returned:     { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  Overdue:      { bg: '#FEF2F2', text: '#DC2626', dot: '#F2726F' },
  // Booking status
  Pending:      { bg: '#FEF3E2', text: '#D97706', dot: '#F5A623' },
  Approved:     { bg: '#E8F8F8', text: '#00A09D', dot: '#00A09D' },
  Cancelled:    { bg: '#FEF2F2', text: '#DC2626', dot: '#F2726F' },
  Completed:    { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  // Maintenance status
  'In Progress': { bg: '#EFF6FF', text: '#2563EB', dot: '#3AB0E6' },
  // Priority
  Critical:     { bg: '#FEF2F2', text: '#DC2626', dot: '#F2726F' },
  High:         { bg: '#FEF3E2', text: '#D97706', dot: '#F5A623' },
  Medium:       { bg: '#EFF6FF', text: '#2563EB', dot: '#3AB0E6' },
  Low:          { bg: '#E8F8F8', text: '#00A09D', dot: '#00A09D' },
  // Asset condition
  New:          { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
  Good:         { bg: '#E8F8F8', text: '#00A09D', dot: '#00A09D' },
  Fair:         { bg: '#FEF3E2', text: '#D97706', dot: '#F5A623' },
  Poor:         { bg: '#FEF2F2', text: '#DC2626', dot: '#F2726F' },
};

interface Props {
  status: StatusType;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, showDot = true, size = 'sm' }: Props) {
  const style = styleMap[status] ?? { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        fontSize: size === 'sm' ? 11 : 12,
      }}
    >
      {showDot && (
        <span className="rounded-full shrink-0" style={{ width: 6, height: 6, backgroundColor: style.dot }} />
      )}
      {status}
    </span>
  );
}
