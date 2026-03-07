import { Finding, RiskLevel } from "../types";

interface Props {
  findings: Finding[];
}

const riskBadge: Record<RiskLevel, string> = {
  HIGH: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  LOW: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

function groupByFile(findings: Finding[]): Map<string, Finding[]> {
  const map = new Map<string, Finding[]>();
  for (const f of findings) {
    const list = map.get(f.filePath) ?? [];
    list.push(f);
    map.set(f.filePath, list);
  }
  return map;
}

export default function FileGroups({ findings }: Props) {
  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
        No findings match your search.
      </div>
    );
  }

  const groups = groupByFile(findings);

  return (
    <div className="space-y-4">
      {[...groups.entries()].map(([filePath, group]) => (
        <div key={filePath} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
              {filePath.replace(/\\/g, "/")}
            </span>
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              {group.length} finding{group.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {group.map((f, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className="text-xs text-gray-400 dark:text-gray-500 w-12 shrink-0">
                  line {f.line}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${riskBadge[f.risk]}`}>
                  {f.risk}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 shrink-0">
                  {f.type.replace(/_/g, " ").toLowerCase()}
                </span>
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500 truncate">
                  {f.content.trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
