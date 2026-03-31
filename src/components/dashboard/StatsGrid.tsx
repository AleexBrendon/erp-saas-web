type Props = {
  stats: any;
};

export function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-white p-5 rounded-xl shadow">
          <span className="text-gray-400 capitalize">{key}</span>
          <h2 className="text-2xl font-bold">{value as number}</h2>
        </div>
      ))}
    </div>
  );
}