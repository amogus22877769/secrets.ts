import { useEffect, useState } from "react";
import { JsonReport, Finding, RiskLevel } from "./types";
import SummaryGrid from "./components/SummaryGrid";
import FindingsTable from "./components/FindingsTable";
import FileGroups from "./components/FileGroups";

type SortField = "file" | "line" | "type" | "risk";
type SortDir = "asc" | "desc";
type ViewMode = "table" | "grouped";

const riskOrder: Record<RiskLevel, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export default function App() {
  const [report, setReport] = useState<JsonReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<SortField>("risk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("./report-data.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setReport)
      .catch(() => setError("Could not load report-data.json. Run the scanner first."));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading report...</p>
      </div>
    );
  }

  const filtered = report.findings.filter((f) =>
    [f.filePath, f.type, f.content].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    let va: string | number;
    let vb: string | number;

    if (sortField === "file") {
      va = a.filePath;
      vb = b.filePath;
    } else if (sortField === "risk") {
      va = riskOrder[a.risk];
      vb = riskOrder[b.risk];
    } else if (sortField === "line") {
      va = a.line;
      vb = b.line;
    } else {
      va = a.type;
      vb = b.type;
    }

    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Secret Leak Scanner Report</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Scanned at {new Date(report.scannedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <SummaryGrid summary={report.summary} total={report.totalFindings} />

        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search by file, type, or snippet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] max-w-sm px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("grouped")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                viewMode === "grouped"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              By File
            </button>
          </div>

          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {filtered.length} finding{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </span>
        </div>

        <div className="mt-4">
          {viewMode === "table" ? (
            <FindingsTable
              findings={sorted}
              sortField={sortField}
              sortDir={sortDir}
              onSort={toggleSort}
            />
          ) : (
            <FileGroups findings={filtered} />
          )}
        </div>
      </main>
    </div>
  );
}
