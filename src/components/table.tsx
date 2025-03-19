import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useEffect } from "react";

export type TableProps<T extends RowData> = {
  columns: ColumnDef<T>[];
  data?: T[];
  toolbar?: ReactNode;
  title: string;
  getRowId?: (row: T, index: number) => string;
};

export default function GenericTable<T extends RowData>({
  columns,
  title,
  data,
  getRowId,
  toolbar,
}: TableProps<T>) {
  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowId,
  });

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {toolbar}
      </div>
      <div className="overflow-x-auto">
        {data && (
          <table className="table table-zebra w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.index}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
