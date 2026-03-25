import { useState } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";

type Schedule = {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
};

type Props = {
  date: Dayjs;
  schedules: Schedule[];
  onChangeDate: (newDate: Dayjs) => void;
};

export default function CalendarDay({ date, schedules, onChangeDate }: Props) {
  const hours = Array.from({ length: 16 }, (_, i) => i + 8);

  const getColorByClient = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = (item: Schedule) => {
    setSelectedSchedule(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedSchedule(null);
  };

  const filteredSchedules = schedules.filter((item) =>
    dayjs(item.date).isSame(date, "day")
  );

  return (
    <div className="flex bg-[#F7F8FC] min-h-screen gap-6">
      <div className="flex-1 bg-white rounded-[5px] p-[30px] shadow-sm">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-slate-800">
            {dayjs(date).format("MMMM D, YYYY")}
          </h2>

          <div className="flex gap-2 text-slate-400">
            <button
              onClick={() => onChangeDate(dayjs(date).subtract(1, "day"))}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => onChangeDate(dayjs(date).add(1, "day"))}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative flex-1">
          {hours.map((h) => (
            <div key={h} className="flex border-b border-slate-100 h-20">
              <span className="w-20 text-xs text-slate-400 mt-1">
                {String(h).padStart(2, "0")}:00
              </span>
              <div className="flex-1 relative" />
            </div>
          ))}

          {filteredSchedules.length === 0 && (
            <div className="absolute top-20 left-0 w-full text-center text-slate-400">
              Nenhum agendamento para este dia
            </div>
          )}

          {[...filteredSchedules]
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((item) => {
              const [hour, minutes] = item.time.split(":").map(Number);

              const top = (hour - 8) * 80 + (minutes / 60) * 80;
              const left = 120 + (minutes / 60) * 600;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpen(item)}
                  className="absolute cursor-pointer rounded-xl px-4 py-2 text-white text-xs shadow-md transition hover:scale-[1.02] w-[180px]"
                  style={{
                    top: top + 10,
                    left: `${left}px`,
                    backgroundColor: getColorByClient(item.client),
                  }}
                >
                  <p className="font-semibold">{item.client}</p>
                  <span className="opacity-80">{item.service}</span>
                  <div className="text-[10px] opacity-70 mt-1">
                    {item.time}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {openModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in"
            style={{ animationFillMode: "forwards" }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>

            <div className="mb-4 border-b border-slate-200 pb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Detalhes do Agendamento
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-700 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex justify-between">
                <span className="font-semibold">Cliente:</span>
                <span>{selectedSchedule.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Serviço:</span>
                <span>{selectedSchedule.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Data:</span>
                <span>{dayjs(selectedSchedule.date).format("DD/MM/YYYY")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Hora:</span>
                <span>{selectedSchedule.time}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}