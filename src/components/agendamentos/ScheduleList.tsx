import { useState, useMemo } from "react";
import { SquarePen, Trash2, Clock, X, Check, CircleX, Hourglass, CalendarCheck, Search } from "lucide-react";
import dayjs from "dayjs";

type ScheduleItem = {
  id: number;
  date: string;
  time: string;
  client: string;
  service: string;
  professional?: string;
  status?: string;
  raw?: any;
};

type Props = {
  schedules: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: number) => void;
  selectedClient: number | null;
};

export default function ScheduleList({
  schedules,
  onEdit,
  onDelete,
  selectedClient,
}: Props) {

  const [selected, setSelected] = useState<ScheduleItem | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Estados para busca e filtro
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const handleOpen = (item: ScheduleItem) => {
    setSelected(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setSelected(null);
    setOpenModal(false);
  };

  const getStatusBg = (status?: string) => {
    switch (status) {
      case "agendado":
        return "bg-gray-200 text-gray-600 uppercase";
      case "confirmado":
        return "bg-yellow-100 text-yellow-600 uppercase";
      case "cancelado":
        return "bg-red-100 text-red-600 uppercase";
      case "concluido":
        return "bg-green-100 text-green-600 uppercase";
      default:
        return "";
    }
  };

  // Filtra schedules por busca e status
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const matchesSearch =
        item.client.toLowerCase().includes(search.toLowerCase()) ||
        item.service.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = filterStatus ? item.status === filterStatus : true;

      return matchesSearch && matchesStatus;
    });
  }, [schedules, search, filterStatus]);

  return (
    <div className="relative">
      {!selectedClient && (
        <div className="absolute -top-10 -right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-[5px] shadow">
          {filteredSchedules.length}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-2 mt-[24px] mb-[14px]">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por cliente ou serviço..."
            className="w-full border rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute text-gray-400 top-2.5 left-3" size={20} />
        </div>

        <select
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-6 px-4 py-3 text-xs font-semibold text-slate-400 uppercase border-b">
          <span className="text-center">Data</span>
          <span className="text-center">Nome</span>
          <span className="text-center">Serviço</span>
          <span className="text-center">Profissional</span>
          <span className="text-center">Status</span>
          <span className="text-center">Ações</span>
        </div>

        <div className="divide-y">
          {filteredSchedules.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              Nenhum agendamento encontrado
            </div>
          )}

          {filteredSchedules.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpen(item)}
              className="grid grid-cols-6 items-center px-4 py-4 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">
                  {dayjs(item.date).format("DD/MM/YYYY")}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <Clock size={14} />
                  {item.time}
                </span>
              </div>

              <div className="text-sm font-medium text-slate-700 text-center">{item.client}</div>
              <div className="text-sm text-slate-600 text-center">{item.service}</div>
              <div className="text-sm text-slate-600 text-center">{item.professional}</div>

              <div className="flex items-center justify-center">
                <div className={`inline-block text-xs font-medium px-3 py-2 rounded-[5px] ${getStatusBg(item.status)}`}>
                  {item.status}
                </div>
              </div>

              <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <SquarePen size={18} />
                </button>
                <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">

            <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition">
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-6 text-slate-800">Detalhes do Agendamento</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-slate-700">Cliente:</span>
                <span className="text-slate-600">{selected.client}</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-slate-700">Serviço:</span>
                <span className="text-slate-600">{selected.service}</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-slate-700">Profissional:</span>
                <span className="text-slate-600">{selected.professional || "-"}</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-slate-700">Data:</span>
                <span className="text-slate-600">{dayjs(selected.date).format("DD/MM/YYYY")}</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-slate-700">Hora:</span>
                <span className="text-slate-600">{selected.time}</span>
              </div>

              {selected.status && (
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    Status:
                    {selected.status === "concluido" && <span className="text-green-500"><Check /></span>}
                    {selected.status === "cancelado" && <span className="text-red-500"><CircleX /></span>}
                    {selected.status === "confirmado" && <span className="text-yellow-500"><Hourglass /></span>}
                    {selected.status === "agendado" && <span className="text-gray-400"><CalendarCheck /></span>}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBg(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleClose} className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition">
                Fechar
              </button>
              <button onClick={() => { onEdit(selected); handleClose(); }} className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg hover:bg-indigo-50 transition">
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}