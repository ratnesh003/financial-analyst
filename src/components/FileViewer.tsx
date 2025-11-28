"use client";

import React, { useEffect, useState } from "react";

// Basic CSV parser (no external libraries)
function parseCSV(text: string) {
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  // Split using a REGEX that handles quoted commas correctly:
  const splitLine = (line: string) =>
    line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map((cell) =>
      cell.replace(/^"|"$/g, "") // remove surrounding quotes
    ) || [];

  const headers = splitLine(lines[0]);
  const rows = lines.slice(1).map(splitLine);

  return { headers, rows };
}

interface Props {
  file: {
    name: string;
    cloudinaryUrls: string[];
  };
}

const FileViewer = ({ file }: Props) => {
  const [tableData, setTableData] = useState<{
    headers: string[];
    rows: string[][];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCSV() {
      setLoading(true);

      try {
        const url = file.cloudinaryUrls[0] + "?raw=1";

        const res = await fetch(url);
        const text = await res.text();

        const parsed = parseCSV(text);

        setTableData(parsed);
      } catch (err) {
        console.error(err);
        setTableData(null);
      }

      setLoading(false);
    }

    loadCSV();
  }, [file]);

  if (loading)
    return <p className="text-muted-foreground p-4">Loading CSV...</p>;

  if (!tableData)
    return <p className="text-red-500 p-4">Unable to load CSV file.</p>;

  const { headers, rows } = tableData;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{file.name}</h2>

      {/* Scrollable table container */}
      <div className="border rounded-md overflow-auto max-h-[70vh]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border px-3 py-2 text-left font-medium whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-accent/30">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border px-3 py-1 whitespace-nowrap"
                  >
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileViewer;
