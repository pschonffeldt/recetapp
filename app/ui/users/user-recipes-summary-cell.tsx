export default function RecipesSummaryCell({
  owned,
  imported,
  total,
}: {
  owned: number;
  imported: number;
  total: number;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">{total}</span>
      <span className="text-xs text-gray-500">
        own {owned} · imported {imported}
      </span>
    </div>
  );
}
