import { Finding, RiskLevel } from "../types";

type SortField = "file" | "line" | "type" | "risk";
type SortDir = "asc" | "desc";

interface Props {
  findings: Finding[];
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}

const riskBadge: Record<RiskLevel, string> = {
  HIGH: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  LOW: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

function SortIcon({ field, active, dir }: { field: string; active: boolean; dir: SortDir }) {
  if (!active) return <span className="ml-1 opacity-30">↕</span>;
  return <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>;
}

function Th({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {label}
      <SortIcon field={field} active={sortField === field} dir={sortDir} />
    </th>
  );
}

export default function FindingsTable({ findings, sortField, sortDir, onSort }: Props) {
  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
        No findings match your search.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <Th label="File" field="file" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <Th label="Line" field="line" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <Th label="Type" field="type" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <Th label="Risk" field="risk" sortField={sortField} sortDir={sortDir} onSort={onSort} />
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Snippet</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {findings.map((f, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                {f.filePath.replace(/\\/g, "/")}
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{f.line}</td>
              <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                {f.type.replace(/_/g, " ").toLowerCase()}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${riskBadge[f.risk]}`}>
                  {f.risk}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400 max-w-[300px] truncate">
                {f.content.trim()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
