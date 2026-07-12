import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  width?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  pageSize?: number;
  emptySlot?: React.ReactNode;
}

export function DataTable<T>({ columns, data, keyField, pageSize = 10, emptySlot }: Props<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const sliced = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-0">
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {sliced.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  {emptySlot ?? (
                    <div className="py-12 text-center text-sm text-gray-400">No data available</div>
                  )}
                </td>
              </tr>
            ) : (
              sliced.map(row => (
                <tr
                  key={String(row[keyField])}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 px-1">
          <span className="text-xs text-gray-400">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.length)} of {data.length} records
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-all border"
                  style={{
                    backgroundColor: page === pg ? '#714B67' : 'transparent',
                    color: page === pg ? '#fff' : '#374151',
                    borderColor: page === pg ? '#714B67' : '#E5E7EB',
                  }}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
