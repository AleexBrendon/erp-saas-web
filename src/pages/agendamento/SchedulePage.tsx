import { api } from "../../api/axios"
import { useEffect, useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import ScheduleList from "../../components/agendamentos/ScheduleList";
import ScheduleModal from "../../components/agendamentos/ScheduleModal";
import PeopleList from "../../components/agendamentos/PeopleList";
import MiniCalendar from "../../components/agendamentos/MiniCalendar";
import CalendarDay from "../../components/agendamentos/CalendarDay";
import { getServicos, type Servico } from "../../storage/serviceStorage";
import { getClientes } from "../../storage/clientStorage";

import {
  getAgendamentos,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
  type Agendamento,
  type AgendamentoPayload,
} from "../../storage/schedulingStorage";
import dayjs from "dayjs";

export default function SchedulePage() {
  const [view, setView] = useState<"list" | "day">("list");
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [usuarios, setUsuarios] = useState([]);

  const mapAgendamento = (item: Agendamento) => ({
    id: item.id,
    date: item.data,
    time: item.hora,
    client: item.cliente?.nome,
    service: item.servico?.nome,
    professional: item.usuario?.nome,
    status: item.status,
    raw: item,
  });

  const loadAll = async () => {
    const [agendamentos, clientes, servicosData] = await Promise.all([
      getAgendamentos(),
      getClientes(),
      getServicos(),
    ]);

    setSchedules(agendamentos.map(mapAgendamento));
    setPeople(clientes);
    setServicos(servicosData);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const res = await api.get("/usuarios");
        setUsuarios(res.data);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      }
    };

    loadUsuarios();
  }, []);

  const save = async (form: any) => {
    const payload: AgendamentoPayload = {
      empresa_id: 1,
      cliente_id: Number(form.cliente_id),
      servico_id: Number(form.servico_id),
      usuario_id: Number(form.usuario_id),
      data: form.data,
      hora: form.hora + ":00",
      observacao: form.observacao,
      status: form.status,
    };

    if (editData?.id) {
      await updateAgendamento(editData.id, payload);
    } else {
      await createAgendamento(payload);
    }

    await loadAll();
    setModal(false);
    setEditData(null);
  };

  const remove = async (id: number) => {
    await deleteAgendamento(id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredSchedules = selectedClient
    ? schedules.filter((s) => s.raw.cliente_id === selectedClient)
    : schedules;

  return (
    <div>
      <h1 className="text-title font-bold mb-[20px] ml-[30px] text-colortitle">Agendamentos</h1>
      <div className="flex h-screen border-separate border-spacing-y-[10px] bg-[#F8F9FD] rounded-[10px] border-slate-100 p-[20px]">

        <aside className="w-80 bg-white border shadow rounded-[5px] p-[20px] flex flex-col gap-6 min-h-0">
          <h1 className="text-subtitle font-semibold text-color">Calendário</h1>

          <button
            onClick={() => {
              setEditData(null);
              setModal(true);
            }}
            className="flex items-center justify-center bg-[#5C67FF] hover:bg-[#4a54e1] text-white px-6 py-2.5 rounded-[5px] text-sm font-medium transition-all shadow-md"
          >
            <Plus size={18} />
            Agendamento
          </button>

          <div className="border border-gray-200 p-[20px] rounded-[5px]">
            <MiniCalendar
              onSelectDate={(date) => {
                setSelectedDate(date);
                setView("day");
              }}
            />
          </div>

          <div className="flex flex-col min-h-0 flex-1">
            <h2 className="text-subtitle text-subtitle mb-[14px]">Clientes</h2>
            <div className="flex-1 min-h-0">
              <PeopleList
                people={people}
                selected={selectedClient}
                onSelect={setSelectedClient}
                schedules={schedules}
              />
            </div>
          </div>
        </aside>

        <main className="flex-1 pl-[20px] overflow-y-auto">

          {view === "list" && (
            <>
              <div className="bg-white rounded-[5px] border shadow-sm p-[20px]">
                {selectedClient && (
                  <div className="mb-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="text-xs text-indigo-600 flex items-center justify-center"
                    >
                      <ChevronLeft size={25} />
                    </button>
                  </div>
                )}
                <ScheduleList
                  schedules={filteredSchedules}
                  selectedClient={selectedClient}
                  onEdit={(item: any) => {
                    setEditData(item.raw);
                    setModal(true);
                  }}
                  onDelete={remove}
                />
              </div>
            </>
          )}

          {view === "day" && selectedDate && (
            <>
              <button
                onClick={() => setView("list")}
                className="text-indigo-600 pb-[20px]"
              >
                <ChevronLeft size={25} />
              </button>

              <CalendarDay
                date={selectedDate}
                schedules={filteredSchedules.filter(
                  (s) =>
                    dayjs(s.date).format("YYYY-MM-DD") ===
                    dayjs(selectedDate).format("YYYY-MM-DD")
                )}
                onChangeDate={setSelectedDate}
              />
            </>
          )}
        </main>

        <ScheduleModal
          open={modal}
          onClose={() => setModal(false)}
          onSave={save}
          people={people}
          servicos={servicos}
          usuarios={usuarios}
          editData={editData}
        />
      </div >
    </div >
  );
}