import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | any;
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  exportable?: boolean;
  onExport?: () => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  exportable = false,
  onExport,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const safeData: T[] = Array.isArray(data)
    ? data
    : data && Array.isArray((data as any).content)
    ? (data as any).content
    : [];

  const filteredData = safeData.filter((item) =>
    Object.values(item).some(
      (val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    return sortDirection === 'asc' ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortKey(null);
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    if (onExport) {
      onExport();
      return;
    }

    if (safeData.length === 0) return;

    const headers = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');
    const rows = safeData.map((item) => {
      return columns
        .map((col) => {
          let val = item[col.key];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'object') val = JSON.stringify(val);
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvString = [headers, ...rows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/90 dark:bg-[#080b38]/70 border border-[#9ed9db]/50 dark:border-[#522377]/40 rounded-3xl flex flex-col overflow-hidden shadow-sm dark:shadow-[#080b38]/50 backdrop-blur-md">
      {/* Table Toolbar */}
      <div className="p-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-[#f3f9fc]/50 dark:bg-[#133155]/30">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#0891b2] dark:text-[#38bdf8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#080b38] border border-slate-200 dark:border-[#522377]/50 rounded-xl text-xs text-[#0f172a] dark:text-[#f8fafc] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-sans"
          />
        </div>

        {exportable && (
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs text-[#0f172a] dark:text-slate-200">
          <thead className="sticky top-0 bg-[#f3f9fc] dark:bg-[#080b38]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 text-[11px] uppercase tracking-wider text-[#0e7490] dark:text-[#f5d0fe] font-mono select-none z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={clsx(
                    'py-3 px-4 font-black',
                    col.sortable && 'cursor-pointer hover:text-[#0f172a] dark:text-white dark:hover:text-white',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={clsx(
                      'inline-flex items-center gap-1',
                      col.align === 'right' && 'justify-end',
                      col.align === 'center' && 'justify-center'
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400 dark:text-[#38bdf8]">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3 h-3 text-[#0891b2] dark:text-[#38bdf8]" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-[#0891b2] dark:text-[#38bdf8]" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-white/10 font-sans">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="h-3 bg-slate-200 dark:bg-purple-900/40 rounded w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-slate-500 dark:text-slate-400 font-mono">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-[#cfeef1]/20 dark:hover:bg-[#522377]/20 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        'py-3 px-4 text-[#0f172a] dark:text-slate-200 font-medium',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center'
                      )}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-[#f3f9fc]/50 dark:bg-[#133155]/30 select-none">
        <div className="font-mono">
          Showing {paginatedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="px-2 font-mono text-[11px] text-[#0891b2] dark:text-[#f5d0fe] font-bold">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
