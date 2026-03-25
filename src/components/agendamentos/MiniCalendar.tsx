import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ChevronLeft, ChevronRight } from "lucide-react";

dayjs.locale("pt-br");

export default function MiniCalendar({ onSelectDate }: { onSelectDate: (date: any) => void }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const start = currentDate.startOf("month").day();
  const daysInMonth = currentDate.daysInMonth();
  const days: (number | null)[] = [];

  for (let i = 0; i < start; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-white w-full max-w-[280px]">

      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-sm font-bold text-slate-800">
          {currentDate.locale("pt-br").format("MMMM YYYY")}
        </span>

        <div className="flex gap-2">
          <ChevronLeft
            size={16}
            className="text-slate-400 cursor-pointer"
            onClick={() => {
              setCurrentDate(prev => prev.subtract(1, "month"));
              setSelectedDay(null);
            }}
          />

          <ChevronRight
            size={16}
            className="text-slate-400 cursor-pointer"
            onClick={() => {
              setCurrentDate(prev => prev.add(1, "month"));
              setSelectedDay(null);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 text-[11px] font-medium text-slate-400 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <span key={i} className="text-center">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map((d, i) => {
          const isSelected = d === selectedDay;

          return (
            <div key={i} className="flex justify-center items-center">
              {d && (
                <button
                  onClick={() => {
                    setSelectedDay(d);
                    onSelectDate(currentDate.date(d).clone());
                  }}
                  className={`w-7 h-7 flex items-center justify-center text-[11px] rounded-full transition-all
                    ${isSelected
                      ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-200"
                      : "text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  {d}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}