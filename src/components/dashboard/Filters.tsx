type Props = {
  filtro: number;
  setFiltro: (v: number) => void;
  tipo: string;
  setTipo: (v: any) => void;
};

export function Filters({ filtro, setFiltro, tipo, setTipo }: Props) {
  return (
    <div className="flex justify-end gap-2 mb-6">
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="agendamentos">Agendamentos</option>
        <option value="financeiro">Financeiro</option>
        <option value="servicos">Serviços</option>
      </select>
      <select
        value={filtro}
        onChange={(e) => setFiltro(Number(e.target.value))}
        className="px-3 py-2 border rounded-lg"
      >
        <option value={7}>7 dias</option>
        <option value={15}>15 dias</option>
        <option value={30}>1 mês</option>
        <option value={90}>3 meses</option>
        <option value={365}>1 ano</option>
      </select>
    </div>
  );
}