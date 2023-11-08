import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/pro-regular-svg-icons";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Key = {
  id: string;
  name: string;
  decryptedKey: string;
  createdAt: string;
  lastUsedAt: string;
};

interface KeyTableProps {
  keys: Key[];
  selectedKeys: any;
  setSelectedKeys: any;
}

const KeyTable: React.FC<KeyTableProps> = ({
  keys,
  selectedKeys,
  setSelectedKeys,
}) => {
  const columnHelper = createColumnHelper<Key>();
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => (
        <input
          type="checkbox"
          checked={selectedKeys.includes(info.row.original.decryptedKey)}
          onChange={(e) =>
            handleSelectKey(info.row.original.decryptedKey, e.target.checked)
          }
        />
      ),
      header: () => (
        <input
          type="checkbox"
          checked={selectedKeys.length === keys.length}
          onChange={handleSelectAllKeys}
        />
      ),
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("decryptedKey", {
      cell: (info) => formatDecryptedKey(info.getValue()),
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("lastUsedAt", {
      cell: (info) => formatDate(info.getValue()),
    }),
  ];

  const table = useReactTable({
    data: keys,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Utility function to format the date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Utility function to format the decryptedKey
  const formatDecryptedKey = (decryptedKey: string) => {
    if (decryptedKey.length > 6) {
      const firstThree = decryptedKey.substring(0, 3);
      const lastThree = decryptedKey.substring(decryptedKey.length - 3);
      const maskedSection = "*".repeat(decryptedKey.length - 6);
      return `${firstThree}${maskedSection}${lastThree}`;
    }
    return decryptedKey; // return as is if the key is too short to mask
  };

  const handleSelectKey = (id: string, isSelected: boolean) => {
    setSelectedKeys((prevSelectedKeys: string[]) => {
      if (isSelected) {
        // If the checkbox is checked, add the key's id to the array
        return [...prevSelectedKeys, id];
      } else {
        // If the checkbox is unchecked, remove the key's id from the array
        return prevSelectedKeys.filter((keyId: string) => keyId !== id);
      }
    });
  };

  // Function to handle selection of all keys
  const handleSelectAllKeys = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedKeys(
      e.target.checked ? keys.map((key) => key.decryptedKey) : []
    );
  };

  return (
    <div className="bg-[#222831] w-full h-fit border border-[#393E46] rounded">
      <table className="w-full">
        <thead className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="transition-colors hover:bg-[#393E46]"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left border-b p-4 border-[#393E46] text-white"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  <FontAwesomeIcon icon={faSort} className="ml-2" />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-[#393E46]">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 border-[#393E46] text-white">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeyTable;
