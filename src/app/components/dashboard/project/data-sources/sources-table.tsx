import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/pro-regular-svg-icons";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Source = {
  id: string;
  source: string;
  type: string;
  insertedAt: string;
  charCount: number;
  isActive: boolean;
};

interface SourcesTableProps {
  sources: Source[];
  selectedSources: string[];
  setSelectedSources: React.Dispatch<React.SetStateAction<string[]>>;
}

const SourcesTable: React.FC<SourcesTableProps> = ({
  sources,
  selectedSources,
  setSelectedSources,
}) => {
  const columnHelper = createColumnHelper<Source>();
  const columns = [
    columnHelper.accessor("id", {
      header: () => (
        <input
          type="checkbox"
          checked={selectedSources?.length === sources.length}
          onChange={handleSelectAllSources}
        />
      ),
      cell: (info) => (
        <input
          type="checkbox"
          checked={selectedSources?.includes(info.row.original.source)}
          onChange={() => handleSelectSource(info.row.original.source)}
        />
      ),
    }),
    columnHelper.accessor("source", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("type", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("charCount", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("insertedAt", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("isActive", {
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: sources,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSelectSource = (source: string) => {
    setSelectedSources((prev) => {
      if (prev.includes(source)) {
        return prev.filter((sourceUrl) => sourceUrl !== source);
      } else {
        return [...prev, source];
      }
    });
  };

  const handleSelectAllSources = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSources(sources.map((source) => source.source));
    } else {
      setSelectedSources([]);
    }
  };

  return (
    <div
      className="bg-[#222831] w-full h-fit border border-[#393E46] shadow-lg rounded overflow-auto max-w-full"
      style={{ height: "500px" }}
    >
      <table className="w-full border-collapse border-spacing-0">
        <thead className="sticky top-0 bg-[#222831]">
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
        <tbody className="">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-[#393E46]">
              {row.getVisibleCells().map((cell) => {
                let url = cell.getValue() as string;
                if (
                  typeof url === "string" &&
                  !url.startsWith("http://") &&
                  !url.startsWith("https://")
                ) {
                  url = "http://" + url;
                }
                return (
                  <td key={cell.id} className="p-4 border-[#393E46] text-white">
                    {cell.column.id === "source" &&
                    row.original.type === "website" ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </a>
                    ) : (
                      <a>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </a>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SourcesTable;
