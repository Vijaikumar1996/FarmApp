import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function DataTable({
  data,
  columns,
  pinnedColumns = {},
  pageSize = 10,
  emptyMessage = "No data found",
  globalSearch = true,
  loading = false,
  serverPagination = false,
  currentPage = 1,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnPinning, setColumnPinning] = useState(pinnedColumns);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnPinning, globalFilter },
    onSortingChange: setSorting,
    onColumnPinningChange: setColumnPinning,
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(serverPagination
      ? {}
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
        }),
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRecords / pageSize)),
    [totalRecords, pageSize],
  );

  const showPagination = serverPagination
    ? totalRecords > pageSize
    : table.getFilteredRowModel().rows.length > pageSize;

  const rows = serverPagination
    ? table.getCoreRowModel().rows
    : table.getRowModel().rows;

  return (
    <div className="overflow-x-auto">
      {globalSearch && !serverPagination && (
        <div className="mb-4 text-right">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border px-3 py-2 rounded w-full max-w-sm"
          />
        </div>
      )}

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isPinned = header.column.getIsPinned();
                return (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer ${
                      isPinned ? "sticky left-0 bg-gray-50 z-10" : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => {
                  const isPinned = cell.column.getIsPinned();
                  return (
                    <td
                      key={cell.id}
                      className={`px-4 py-3 ${isPinned ? "sticky left-0 bg-white z-10" : ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showPagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-sm">
          {serverPagination ? (
            <>
              <div>
                Showing{" "}
                {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalRecords)} of{" "}
                {totalRecords} records
              </div>

              <div className="flex items-center gap-2">
                <span>Rows</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <button
                  onClick={() => onPageChange?.(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  First
                </button>
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => onPageChange?.(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border rounded"
                >
                  First
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border rounded"
                >
                  Prev
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border rounded"
                >
                  Next
                </button>
                <button
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border rounded"
                >
                  Last
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
