export const CustomerDetails = ({ customer }: any) => (
  <div className="w-[350px] bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">
    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-slate-100 mb-4 overflow-hidden">
        <img src={`https://ui-avatars.com/api/?name=${customer.nome}&background=ebebeb`} alt="" />
    </div>
    <h2 className="text-xl font-bold text-[#1B2559]">{customer.nome}</h2>
    <p className="text-[#A3AED0] text-sm mb-8 font-medium">UX/UI Designer</p>

    <div className="w-full space-y-6 text-left">
      <div>
        <h3 className="font-bold text-[#1B2559] mb-4">Contact Info</h3>
        <div className="space-y-4">
          <DetailItem label="Email" value={customer.email} />
          <DetailItem label="Phone" value={customer.telefone} />
        </div>
      </div>
      <hr className="border-slate-50" />
      <div>
        <h3 className="font-bold text-[#1B2559] mb-4">Performance</h3>
        <div className="flex items-end justify-between h-20 gap-2">
          {[40, 70, 45, 90, 60, 85].map((h, i) => (
            <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-[#F4F7FE] rounded-t-sm hover:bg-[#5C67FF] transition-all" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value }: any) => (
  <div>
    <p className="text-[10px] text-[#A3AED0] uppercase font-bold">{label}</p>
    <p className="text-sm text-[#1B2559] font-semibold">{value}</p>
  </div>
);