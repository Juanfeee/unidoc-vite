import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  ColumnFiltersState
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  globalFilter?: string;
  loading?: boolean;
}

export function DataTable<TData extends Record<string, any>>({
  data,
  columns,
  globalFilter = "",
  loading = false,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="overflow-x-auto w-full rounded-lg border border-bg-[#266AAE]">
      <table className="w-fit">
        <thead className="bg-[#266AAE]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr 
            className=" "
            key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase "
                >
                  <div className="flex items-center justify-between h-[80px]">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                  {header.column.getCanFilter() && (
                    <div className="flex  items-center justify-center text-black">
                      <input
                        type="text"
                        value={
                          (header.column.getFilterValue() as string) ?? ""
                        }
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        placeholder={`Buscar...`}
                        className="p-1 w-full text-sm text-black rounded-lg bg-white"
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-bg-[#266AAE]">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-200">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
