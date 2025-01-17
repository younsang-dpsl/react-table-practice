import { useMemo, useState } from "react";
import "./App.css";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: "select",
        header: (props) => <input type="checkbox" />,
        cell: (props) => <input type="checkbox" />,
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
  });

  return (
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
  );
}

export default App;
