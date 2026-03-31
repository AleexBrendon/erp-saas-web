type Props = {
  title: string;
  data: any[];
};

export function TopList({ title, data }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="mb-3 font-semibold">{title}</h2>

      {data.map((item) => (
        <div key={item.nome} className="flex justify-between py-2 border-b">
          <span>{item.nome}</span>
          <strong>{item.total}</strong>
        </div>
      ))}
    </div>
  );
}