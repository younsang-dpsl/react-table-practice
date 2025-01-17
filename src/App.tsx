import { useMemo, useState } from "react";
import "./App.css";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

interface User {
  id: number;
  name: string;
  /**
   * xxxx@xxxx.com
   */
  email: string;
  /**
   * xxx-xxxx-xxxx
   */
  mobile: string;
  age: number;
  gender: "male" | "female";
  status: "sad" | "angry" | "happy" | "relaxed";
}

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateMockUsers(count: number): User[] {
  const mockUsers: User[] = [];
  const genders: User["gender"][] = ["male", "female"];
  const statuses: User["status"][] = ["sad", "angry", "happy", "relaxed"];

  for (let i = 0; i < count; i++) {
    const user: User = {
      id: i + 1,
      name: generateRandomString(8),
      email: `${generateRandomString(5)}@example.com`,
      mobile: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      age: Math.floor(18 + Math.random() * 42), // Random age between 18 and 60
      gender: genders[Math.floor(Math.random() * genders.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };

    mockUsers.push(user);
  }

  return mockUsers;
}

const mockData = generateMockUsers(1000);

function App() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={() => {
              table.toggleAllRowsSelected();
            }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={() => {
              row.toggleSelected();
            }}
          />
        ),
      },
      { header: "ID", accessorKey: "id" },
      {
        header: "Name",
        accessorKey: "name",
      },
    ],
    []
  );

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
  });

  return (
    <main>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: "32px" }}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          PREV
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          NEXT
        </button>
        <label>
          Go to Page:
          <input
            type="number"
            placeholder="set Page.."
            min={0}
            max={table.getPageCount() - 1}
            value={table.getState().pagination.pageIndex}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 0;
              table.setPageIndex(page);
            }}
          />
        </label>
      </div>
      <div>
        Showing{" "}
        {(
          table.getRowModel().rows.length *
          (table.getState().pagination.pageIndex + 1)
        ).toLocaleString()}{" "}
        of {table.getRowCount().toLocaleString()} Data
      </div>
    </main>
  );
}

export default App;
