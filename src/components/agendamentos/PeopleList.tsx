import type { Cliente } from "../../storage/clientStorage";

type Props = {
  people: Cliente[];
  selected: number | null;
  onSelect: (id: number) => void;
  schedules: any[]; // 👈 novo
};

export default function PeopleList({ people, selected, onSelect, schedules }: Props) {

  const countByClient = (clientId: number) => {
    return schedules.filter((s) => s.raw.cliente_id === clientId).length;
  };

  return (
  <div className="relative h-full">
    
    <div className="h-full overflow-y-auto pr-2 smooth-scroll scrollbar-hide space-y-2">
      {people.map((p) => {
        const count = countByClient(p.id);

        return (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`
              flex items-center justify-between p-2 rounded-lg cursor-pointer transition
              ${selected === p.id ? "bg-indigo-100" : "hover:bg-slate-100"}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-xs font-semibold">
                {p.nome?.charAt(0)}
              </div>

              <span className="text-content text-slate-700">
                {p.nome}
              </span>
            </div>

            {count > 0 && (
              <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
        );
      })}
    </div>

    <div className="pointer-events-none absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-white to-transparent" />

    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent" />
  </div>
);
}