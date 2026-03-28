import { useState } from "react";

type Option = {
  id: number;
  nome?: string;
  descricao?: string;
};

type Props = {
  options: Option[];
  value: number | "";
  onChange: (id: number) => void;
  placeholder: string;
  labelKey?: "nome" | "descricao" | "id";
};

export default function SmartSelect({
  options,
  value,
  onChange,
  placeholder,
  labelKey = "nome",
}: Props) {
  const [search, setSearch] = useState("");

  const getLabel = (item: Option) => {
    if (labelKey === "id") return `Venda #${item.id}`;

    return item[labelKey] || item.nome || item.descricao || "Sem nome";
  };

  // 🔥 AQUI ESTAVA FALTANDO
  const filtered = options.filter((item) =>
    getLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 mb-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-40 overflow-auto border rounded-lg">
        {filtered.length === 0 && (
          <div className="p-2 text-sm text-gray-400">
            Nenhum resultado
          </div>
        )}

        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`px-3 py-2 cursor-pointer hover:bg-indigo-50 ${
              value === item.id ? "bg-indigo-100" : ""
            }`}
          >
            {getLabel(item)}
          </div>
        ))}
      </div>
    </div>
  );
}