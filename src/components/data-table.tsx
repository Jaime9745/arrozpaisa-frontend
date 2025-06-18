import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  useCardStyle?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilter,
  onGlobalFilterChange,
  useCardStyle = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: onGlobalFilterChange,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });
  const getSortIcon = (column: any) => {
    const sortDirection = column.getIsSorted();
    if (sortDirection === "asc") {
      return <ChevronUp className="ml-2 h-6 w-6" />;
    }
    if (sortDirection === "desc") {
      return <ChevronDown className="ml-2 h-6 w-6" />;
    }
    return <ChevronsUpDown className="ml-2 h-6 w-6 text-gray-400" />;
  };
  return (
    <div className="space-y-4">
      {useCardStyle ? (
        <div className="space-y-4">
          {" "}
          {/* Header row for sorting - only visible on larger screens */}
          <div className="hidden lg:flex px-6 py-3 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className={`flex items-center ${
                      header.id === "actions" ? "w-20 justify-center" : "flex-1"
                    } ${
                      header.column.getCanSort()
                        ? "cursor-pointer select-none hover:text-gray-900"
                        : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span
                      style={{
                        color: "#030229",
                        fontWeight: 400,
                        opacity: 0.7,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                    {header.column.getCanSort() && getSortIcon(header.column)}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Card rows */}
          <div className="space-y-4">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl shadow-sm p-4 sm:p-6 space-y-3 sm:space-y-0 sm:flex sm:items-center"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    // Special styling for the actions column
                    if (cell.column.id === "actions") {
                      return (
                        <div
                          key={cell.id}
                          className="flex justify-end sm:justify-center sm:w-20 mt-3 sm:mt-0"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      );
                    }

                    // Get header name for mobile labels
                    const headerGroup = table.getHeaderGroups()[0];
                    const header = headerGroup?.headers[index];
                    const headerText = header
                      ? typeof header.column.columnDef.header === "string"
                        ? header.column.columnDef.header
                        : header.id
                      : "";

                    // Regular columns with responsive design
                    return (
                      <div key={cell.id} className="flex-1 min-w-0">
                        {/* Mobile: Show header label above content */}
                        <div className="sm:hidden text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                          {headerText}
                        </div>
                        {/* Content */}
                        <div className="break-words">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="text-center py-10">No hay resultados.</div>
            )}
          </div>
        </div>
      ) : (
        // Original table view
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center space-x-2 ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none hover:text-gray-900"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {header.column.getCanSort() &&
                              getSortIcon(header.column)}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
