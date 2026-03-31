type Props = {
  data: any[];
  total: number;
};

const colors = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#a855f7",
];

export function Legend({ data, total }: Props) {
  return (
    <div className="mt-4 space-y-2">
      {data.map((item, i) => {
        const percent = ((item.total / total) * 100).toFixed(1);
        return (
          <div key={i} className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
              <span className="text-gray-600">{item.nome}</span>
            </div>
            <div className="text-gray-900 font-medium">
              {item.total}{" "}
              <span className="text-gray-400 text-xs">
                ({percent}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}