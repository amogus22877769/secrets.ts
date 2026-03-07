import SummaryCard from "./SummaryCard";

interface Props {
  total: number;
  summary: { HIGH: number; MEDIUM: number; LOW: number };
}

export default function SummaryGrid({ total, summary }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <SummaryCard title="Total Findings" value={total} color="blue" />
      <SummaryCard title="High Risk" value={summary.HIGH} color="red" />
      <SummaryCard title="Medium Risk" value={summary.MEDIUM} color="yellow" />
      <SummaryCard title="Low Risk" value={summary.LOW} color="gray" />
    </div>
  );
}
